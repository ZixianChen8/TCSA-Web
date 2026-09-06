from datetime import date

from django.db import transaction
from django.utils import timezone

from .models import (
    ClubMember,
    MembershipApplication,
    MembershipPayment,
    MembershipSettings,
    MembershipStatusLog,
    MembershipType,
    MemberEvent,
    MemberEventSignup,
)
from .membership_email import (
    send_activation_email,
    send_anomaly_email,
    send_application_received_email,
    send_lookup_reminder_email,
    send_refund_email,
)

UOTTAWA_SUFFIXES = ("@uottawa.ca",)
HOLDING_SIGNUP_STATUSES = (
    MemberEventSignup.STATUS_SUBMITTED,
    MemberEventSignup.STATUS_UNDER_REVIEW,
    MemberEventSignup.STATUS_CONFIRMED,
    MemberEventSignup.STATUS_WAITLISTED,
    MemberEventSignup.STATUS_ATTENDED,
)


def is_uottawa_email(email):
    return bool(email) and email.lower().endswith(UOTTAWA_SUFFIXES)


def _next_sequential_id(model, field_name, prefix):
    last = (
        model.objects.select_for_update()
        .filter(**{f"{field_name}__startswith": prefix})
        .order_by(f"-{field_name}")
        .first()
    )
    n = 1
    if last:
        try:
            n = int(getattr(last, field_name).split("-")[-1]) + 1
        except (TypeError, ValueError):
            n = 1
    return f"{prefix}{n:04d}"


def generate_member_id(year=None):
    year = year if year is not None else timezone.now().year % 100
    return _next_sequential_id(ClubMember, "member_id", f"TCSA-{year:02d}-")


def generate_application_ref(year=None):
    year = year if year is not None else timezone.now().year % 100
    return _next_sequential_id(MembershipApplication, "application_ref", f"APP-{year:02d}-")


def change_member_status(member, new_status, actor=None, reason=""):
    old = member.status
    if old == new_status:
        return member
    member.status = new_status
    update_fields = ["status", "updated_at"]
    if new_status == ClubMember.STATUS_ACTIVE:
        mtype = member.membership_type
        member.valid_from = mtype.valid_from or date.today()
        member.valid_until = mtype.valid_until
        update_fields.extend(["valid_from", "valid_until"])
    member.save(update_fields=update_fields)
    MembershipStatusLog.objects.create(
        club_member=member,
        from_status=old,
        to_status=new_status,
        actor=actor,
        reason=reason,
    )
    return member


def has_blocking_application(email):
    return ClubMember.objects.filter(
        uottawa_email__iexact=email,
        status__in=ClubMember.BLOCKING_STATUSES,
    ).exists()


@transaction.atomic
def apply_for_membership(payload):
    email = payload["uottawa_email"].strip().lower()
    if not is_uottawa_email(email):
        raise ValueError("A uOttawa email is required.")
    if not payload.get("terms_agreed") or not payload.get("privacy_agreed"):
        raise ValueError("You must agree to the membership terms and privacy policy.")
    if not payload.get("notify_consent"):
        raise ValueError("Notification consent is required.")
    if has_blocking_application(email):
        raise ValueError("An application for this email is already in progress or active.")

    membership_type = MembershipType.objects.filter(
        pk=payload["membership_type_id"],
        is_open=True,
    ).first()
    if not membership_type:
        raise ValueError("That membership type is not available.")

    member_id = generate_member_id()
    member = ClubMember.objects.create(
        legal_name=payload["legal_name"].strip(),
        preferred_name=payload["preferred_name"].strip(),
        uottawa_email=email,
        personal_email=(payload.get("personal_email") or "").strip(),
        wechat_id=(payload.get("wechat_id") or "").strip(),
        linkedin_url=(payload.get("linkedin_url") or "").strip(),
        program=payload["program"].strip(),
        year_of_study=str(payload["year_of_study"]).strip(),
        expected_graduation_year=int(payload["expected_graduation_year"]),
        membership_type=membership_type,
        interested_industries=payload.get("interested_industries") or [],
        preferred_event_types=payload.get("preferred_event_types") or [],
        notify_consent=True,
        terms_agreed=True,
        privacy_agreed=True,
        member_id=member_id,
        status=ClubMember.STATUS_PENDING,
        valid_from=membership_type.valid_from,
        valid_until=membership_type.valid_until,
    )
    application = MembershipApplication.objects.create(
        club_member=member,
        application_ref=generate_application_ref(),
        form_snapshot=payload,
    )
    payment = MembershipPayment.objects.create(
        club_member=member,
        application=application,
        amount_expected=membership_type.price_cad,
        method=MembershipPayment.METHOD_ETRANSFER,
        interac_reference=member_id,
        status=MembershipPayment.STATUS_AWAITING,
    )
    MembershipStatusLog.objects.create(
        club_member=member,
        from_status="",
        to_status=ClubMember.STATUS_PENDING,
        reason="Application submitted",
    )
    return member, application, payment


def apply_and_notify(payload):
    member, application, payment = apply_for_membership(payload)
    send_application_received_email(member, payment)
    return member, application, payment


def confirm_payment(payment, actor, amount_received=None, reason="Payment confirmed"):
    with transaction.atomic():
        payment = MembershipPayment.objects.select_for_update().get(pk=payment.pk)
        member = ClubMember.objects.select_for_update().get(pk=payment.club_member_id)
        received = amount_received if amount_received is not None else payment.amount_expected
        payment.amount_received = received
        payment.status = MembershipPayment.STATUS_CONFIRMED
        payment.confirmed_at = timezone.now()
        payment.confirmed_by = actor
        payment.save()
        change_member_status(member, ClubMember.STATUS_ACTIVE, actor=actor, reason=reason)
    send_activation_email(member)
    return payment


def flag_payment_mismatch(payment, actor, reason="Amount or memo does not match"):
    with transaction.atomic():
        payment = MembershipPayment.objects.select_for_update().get(pk=payment.pk)
        member = ClubMember.objects.select_for_update().get(pk=payment.club_member_id)
        payment.status = MembershipPayment.STATUS_MISMATCH
        payment.notes = reason
        payment.save(update_fields=["status", "notes"])
        change_member_status(
            member,
            ClubMember.STATUS_PAYMENT_REVIEW,
            actor=actor,
            reason=reason,
        )
    send_anomaly_email(member, reason)
    return payment


def refund_payment(payment, actor, amount=None, reason="Refund processed"):
    with transaction.atomic():
        payment = MembershipPayment.objects.select_for_update().get(pk=payment.pk)
        member = ClubMember.objects.select_for_update().get(pk=payment.club_member_id)
        payment.status = MembershipPayment.STATUS_REFUNDED
        payment.refund_amount = amount if amount is not None else payment.amount_received or payment.amount_expected
        payment.refund_reason = reason
        payment.refunded_at = timezone.now()
        payment.save()
        change_member_status(member, ClubMember.STATUS_REFUNDED, actor=actor, reason=reason)
    send_refund_email(member, payment)
    return payment


def lookup_member_id(email):
    """Always return the same public message. Email sent only if a match exists."""
    member = ClubMember.objects.filter(uottawa_email__iexact=email.strip().lower()).first()
    if member:
        send_lookup_reminder_email(member)
    return True


def interac_payload():
    settings = MembershipSettings.load()
    return {
        "payee_name": settings.payee_name,
        "interac_email": settings.interac_email,
        "interac_phone": settings.interac_phone,
        "instruction_text": settings.instruction_text,
        "contact_email": settings.contact_email,
    }


REG_COMING_SOON = "coming_soon"
REG_MEMBER_OPEN = "member_open"
REG_PUBLIC_OPEN = "public_open"
REG_WAITLIST = "waitlist_only"
REG_CLOSED = "closed"
REG_COMPLETED = "completed"
REG_CANCELLED = "cancelled"


def _now():
    return timezone.now()


def counted_signups(event):
    return event.signups.filter(
        status__in=(
            MemberEventSignup.STATUS_SUBMITTED,
            MemberEventSignup.STATUS_UNDER_REVIEW,
            MemberEventSignup.STATUS_CONFIRMED,
            MemberEventSignup.STATUS_ATTENDED,
        )
    ).count()


def waitlisted_count(event):
    return event.signups.filter(status=MemberEventSignup.STATUS_WAITLISTED).count()


def compute_registration_status(event, now=None):
    now = now or _now()
    if event.is_cancelled:
        return REG_CANCELLED
    if event.is_completed:
        return REG_COMPLETED
    if event.end_date and event.end_date < date.today():
        return REG_COMPLETED
    if not event.end_date and event.start_date < date.today():
        return REG_COMPLETED
    if event.registration_deadline and now > event.registration_deadline:
        return REG_CLOSED

    filled = counted_signups(event)
    at_capacity = event.total_capacity and filled >= event.total_capacity

    member_open = event.member_registration_opens and now >= event.member_registration_opens
    public_open = event.public_registration_opens and now >= event.public_registration_opens
    window_started = member_open or public_open or (
        event.member_registration_opens is None and event.public_registration_opens is None
    )

    if not window_started:
        return REG_COMING_SOON
    if at_capacity:
        return REG_WAITLIST if event.waitlist_enabled else REG_CLOSED
    if public_open or (event.public_registration_opens is None and window_started and not event.member_registration_opens):
        return REG_PUBLIC_OPEN
    if member_open:
        return REG_MEMBER_OPEN
    return REG_COMING_SOON


def member_is_eligible_for_event(member, event):
    if member.status != ClubMember.STATUS_ACTIVE:
        return False
    event_date = event.start_date
    if member.valid_from and event_date < member.valid_from:
        return False
    if member.valid_until and event_date > member.valid_until:
        return False
    return True


@transaction.atomic
def register_for_member_event(event, payload):
    now = _now()
    state = compute_registration_status(event, now=now)
    if state in (REG_CANCELLED, REG_COMPLETED, REG_CLOSED, REG_COMING_SOON):
        raise ValueError("Registration is not open for this event.")

    email = payload["email"].strip().lower()
    if event.signups.filter(email__iexact=email).exclude(status=MemberEventSignup.STATUS_CANCELLED).exists():
        raise ValueError("This email is already registered for this event.")

    member = None
    member_id = (payload.get("member_id") or "").strip().upper()
    is_member_attempt = bool(member_id)

    if state == REG_MEMBER_OPEN or is_member_attempt:
        if not member_id:
            raise ValueError("Active members must enter their member ID.")
        member = ClubMember.objects.filter(member_id__iexact=member_id).first()
        if not member or member.uottawa_email.lower() != email:
            raise ValueError("Email and member ID do not match.")
        if not member_is_eligible_for_event(member, event):
            raise ValueError("Membership is not active for this event date.")
    elif state in (REG_PUBLIC_OPEN, REG_WAITLIST):
        if member_id:
            member = ClubMember.objects.filter(member_id__iexact=member_id).first()
            if member and member.uottawa_email.lower() != email:
                raise ValueError("Email and member ID do not match.")
            if member and not member_is_eligible_for_event(member, event) and state != REG_WAITLIST:
                member = None
        if not member and not is_uottawa_email(email) and state != REG_WAITLIST:
            # public window still expects a student email
            if not email:
                raise ValueError("Email is required.")

    if state == REG_MEMBER_OPEN and not member:
        raise ValueError("Only Active members can register during the priority window.")

    filled = counted_signups(event)
    at_capacity = event.total_capacity and filled >= event.total_capacity
    if at_capacity and not event.waitlist_enabled:
        raise ValueError("This event is full.")

    if at_capacity:
        signup_status = MemberEventSignup.STATUS_WAITLISTED
    elif event.requires_review:
        signup_status = MemberEventSignup.STATUS_UNDER_REVIEW
    else:
        signup_status = MemberEventSignup.STATUS_CONFIRMED

    signup = MemberEventSignup.objects.create(
        event=event,
        club_member=member,
        legal_name=(payload.get("legal_name") or (member.legal_name if member else "")).strip(),
        email=email,
        member_id_entered=member_id,
        status=signup_status,
    )
    return signup


def record_attendance(signup, attendance, actor=None):
    previous = signup.attendance
    signup.attendance = attendance
    if attendance == MemberEventSignup.ATTENDANCE_ATTENDED:
        signup.status = MemberEventSignup.STATUS_ATTENDED
    elif attendance == MemberEventSignup.ATTENDANCE_NO_SHOW:
        signup.status = MemberEventSignup.STATUS_NO_SHOW
        if previous != MemberEventSignup.ATTENDANCE_NO_SHOW and signup.club_member:
            signup.club_member.no_show_count = (signup.club_member.no_show_count or 0) + 1
            signup.club_member.save(update_fields=["no_show_count", "updated_at"])
    elif attendance == MemberEventSignup.ATTENDANCE_CANCELLED_ON_TIME:
        signup.status = MemberEventSignup.STATUS_CANCELLED
    signup.save()
    return signup
