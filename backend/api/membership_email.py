import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def _send(subject, body, to_email):
    if not to_email:
        return False
    try:
        send_mail(
            subject,
            body,
            getattr(settings, "DEFAULT_FROM_EMAIL", "membership@tcsaofficial.com"),
            [to_email],
            fail_silently=False,
        )
        return True
    except Exception:
        logger.exception("Membership email failed: %s -> %s", subject, to_email)
        return False


def send_application_received_email(member, payment):
    settings_contact = getattr(settings, "MEMBERSHIP_CONTACT_EMAIL", "")
    body = (
        f"Hi {member.preferred_name},\n\n"
        f"We received your TCSA membership application.\n\n"
        f"Status: Pending payment\n"
        f"Member ID (use this as your Interac memo): {member.member_id}\n"
        f"Amount: CAD ${payment.amount_expected}\n"
        f"Type: {member.membership_type.name}\n\n"
        f"Send an Interac e-transfer, then wait for VP Finance to confirm. "
        f"You will get another email when your membership is active.\n\n"
        f"— TCSA Membership\n{settings_contact}"
    )
    return _send("TCSA membership application received", body, member.uottawa_email)


def send_activation_email(member):
    valid = ""
    if member.valid_from or member.valid_until:
        valid = f"Validity: {member.valid_from or '—'} to {member.valid_until or '—'}\n"
    body = (
        f"Hi {member.preferred_name},\n\n"
        f"Your TCSA membership is now Active.\n\n"
        f"Member ID: {member.member_id}\n"
        f"Type: {member.membership_type.name}\n"
        f"{valid}\n"
        f"Use your uOttawa email and member ID to register for member events:\n"
        f"https://tcsaofficial.com/membership/events\n\n"
        f"Policies: https://tcsaofficial.com/membership/policies\n\n"
        f"— TCSA Membership"
    )
    return _send("Your TCSA membership is active", body, member.uottawa_email)


def send_anomaly_email(member, reason):
    body = (
        f"Hi {member.preferred_name},\n\n"
        f"We could not confirm your membership payment yet.\n"
        f"Reason: {reason}\n\n"
        f"Member ID: {member.member_id}\n"
        f"Please contact the membership coordinator if you already sent the e-transfer.\n\n"
        f"— TCSA Membership"
    )
    return _send("TCSA membership payment needs review", body, member.uottawa_email)


def send_refund_email(member, payment):
    amount = payment.refund_amount or payment.amount_received or payment.amount_expected
    body = (
        f"Hi {member.preferred_name},\n\n"
        f"Your TCSA membership fee has been marked as refunded.\n"
        f"Amount: CAD ${amount}\n"
        f"Member ID {member.member_id} is retained and will not be reassigned.\n\n"
        f"— TCSA Membership"
    )
    return _send("TCSA membership refund confirmation", body, member.uottawa_email)


def send_lookup_reminder_email(member):
    body = (
        f"Hi {member.preferred_name},\n\n"
        f"Your TCSA member ID is {member.member_id}.\n"
        f"Current status: {member.get_status_display()}\n\n"
        f"— TCSA Membership"
    )
    return _send("Your TCSA member ID", body, member.uottawa_email)
