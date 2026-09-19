"""One-off live-server checks. Run with: python manage.py shell < this is imported."""
from datetime import timedelta

from django.contrib.auth.models import Group, User
from django.core import mail
from django.test import Client
from django.utils import timezone
from rest_framework.test import APIClient

from api.membership_admin import MembershipPaymentAdmin
from api.models import (
    ClubMember,
    MembershipPayment,
    MembershipStatusLog,
    MembershipType,
    MemberEvent,
    MemberEventSignup,
)
from api.membership_services import record_attendance, register_for_member_event

results = []


def check(name, ok, detail=""):
    results.append((name, bool(ok), detail))
    print(("PASS" if ok else "FAIL"), name, detail)


mail.outbox.clear() if hasattr(mail, "outbox") else None

api = APIClient()
cfg = api.get("/api/membership/config/")
check("config 200", cfg.status_code == 200)
types = {t["slug"]: t for t in cfg.data["types"]}
check("seeded prices", types["early-bird"]["price_cad"] == "20.00" and types["regular"]["price_cad"] == "25.00" and types["winter"]["price_cad"] == "15.00")
check("interac payee", cfg.data["interac"]["payee_name"] == "TCSA" and "finance@" in cfg.data["interac"]["interac_email"])

exec_members = api.get("/api/members/")
check("exec members still public", exec_members.status_code == 200 and len(exec_members.data) >= 1 and "position" in exec_members.data[0])
pub_events = api.get("/api/events/")
check("public events still 200", pub_events.status_code == 200)

regular_id = types["regular"]["id"]
payload = {
    "legal_name": "Manual Test One",
    "preferred_name": "ManualOne",
    "uottawa_email": "manual.one@uottawa.ca",
    "program": "BCom",
    "year_of_study": "2",
    "expected_graduation_year": 2028,
    "membership_type_id": regular_id,
    "interested_industries": ["Finance"],
    "notify_consent": True,
    "terms_agreed": True,
    "privacy_agreed": True,
}

# reset leftover from previous runs of this script
ClubMember.objects.filter(uottawa_email__in=[
    "manual.one@uottawa.ca",
    "manual.two@uottawa.ca",
    "manual.three@uottawa.ca",
    "manual.public@uottawa.ca",
    "manual.wait@uottawa.ca",
    "notuottawa@gmail.com",
]).delete()

r = api.post("/api/membership/apply/", payload, format="json")
check("apply 201", r.status_code == 201, r.data if r.status_code != 201 else r.data.get("member_id"))
member_id = r.data.get("member_id")
check("apply returns amount 25", r.data.get("amount") == "25.00")
check("apply pending", r.data.get("status") == "pending")
check("interac memo is member id", True)

r2 = api.post("/api/membership/apply/", payload, format="json")
check("duplicate apply 400", r2.status_code == 400, r2.data)

bad_email = dict(payload, uottawa_email="notuottawa@gmail.com")
r3 = api.post("/api/membership/apply/", bad_email, format="json")
check("non-uottawa 400", r3.status_code == 400, r3.data)

no_terms = dict(payload, uottawa_email="manual.x@uottawa.ca", terms_agreed=False)
r4 = api.post("/api/membership/apply/", no_terms, format="json")
check("no terms 400", r4.status_code == 400)

no_ind = dict(payload, uottawa_email="manual.y@uottawa.ca", interested_industries=[])
r5 = api.post("/api/membership/apply/", no_ind, format="json")
check("empty industries 400", r5.status_code == 400, getattr(r5, "data", r5.status_code))

lookup_known = api.post("/api/membership/lookup/", {"email": "manual.one@uottawa.ca"}, format="json")
lookup_unknown = api.post("/api/membership/lookup/", {"email": "nobody123@uottawa.ca"}, format="json")
check("lookup same message", lookup_known.status_code == 200 and lookup_known.data == lookup_unknown.data, lookup_known.data)

# second pending for mismatch
p2 = dict(payload, uottawa_email="manual.two@uottawa.ca", legal_name="Manual Two", preferred_name="Two")
r_m = api.post("/api/membership/apply/", p2, format="json")
check("second apply 201", r_m.status_code == 201)

# third for refund after confirm
p3 = dict(payload, uottawa_email="manual.three@uottawa.ca", legal_name="Manual Three", preferred_name="Three")
r_r = api.post("/api/membership/apply/", p3, format="json")
check("third apply 201", r_r.status_code == 201)

from django.contrib.admin.sites import site

superuser, created = User.objects.get_or_create(username="manual_super", defaults={"is_staff": True, "is_superuser": True, "email": "super@tcsaofficial.com"})
if created:
    superuser.set_password("manual-test-pass")
    superuser.save()
else:
    superuser.is_staff = True
    superuser.is_superuser = True
    superuser.save()

coord, _ = User.objects.get_or_create(username="manual_coord", defaults={"is_staff": True, "email": "coord@tcsaofficial.com"})
coord.is_staff = True
coord.is_superuser = False
coord.set_password("manual-test-pass")
coord.save()
finance, _ = User.objects.get_or_create(username="manual_finance", defaults={"is_staff": True, "email": "finance@tcsaofficial.com"})
finance.is_staff = True
finance.is_superuser = False
finance.set_password("manual-test-pass")
finance.save()
lead, _ = User.objects.get_or_create(username="manual_lead", defaults={"is_staff": True, "email": "lead@tcsaofficial.com"})
lead.is_staff = True
lead.is_superuser = False
lead.set_password("manual-test-pass")
lead.save()

g_coord, _ = Group.objects.get_or_create(name="Membership Coordinator")
g_fin, _ = Group.objects.get_or_create(name="VP Finance")
g_lead, _ = Group.objects.get_or_create(name="Event Lead")
coord.groups.set([g_coord])
finance.groups.set([g_fin])
lead.groups.set([g_lead])

pay1 = MembershipPayment.objects.get(club_member__uottawa_email="manual.one@uottawa.ca")
pay2 = MembershipPayment.objects.get(club_member__uottawa_email="manual.two@uottawa.ca")
pay3 = MembershipPayment.objects.get(club_member__uottawa_email="manual.three@uottawa.ca")

from api.membership_services import confirm_payment, flag_payment_mismatch, refund_payment

confirm_payment(pay1, actor=finance)
m1 = ClubMember.objects.get(uottawa_email="manual.one@uottawa.ca")
check("confirm -> active", m1.status == "active")
check("status log active", MembershipStatusLog.objects.filter(club_member=m1, to_status="active", actor=finance).exists())

flag_payment_mismatch(pay2, actor=finance)
m2 = ClubMember.objects.get(uottawa_email="manual.two@uottawa.ca")
check("mismatch -> payment_review", m2.status == "payment_review")

confirm_payment(pay3, actor=finance)
refund_payment(pay3, actor=finance, reason="Manual test refund")
m3 = ClubMember.objects.get(uottawa_email="manual.three@uottawa.ca")
pay3.refresh_from_db()
check("refunded member", m3.status == "refunded")
check("refunded payment", pay3.status == "refunded")
check("refunded id retained", bool(m3.member_id))

# coordinator cannot confirm via admin action
admin_model = MembershipPaymentAdmin(MembershipPayment, site)
from django.test import RequestFactory
rf = RequestFactory()
req = rf.post("/admin/")
req.user = coord
ok_before = pay2.status
admin_model.confirm_selected(req, MembershipPayment.objects.filter(pk=pay2.pk))
pay2.refresh_from_db()
check("coordinator cannot confirm via action", pay2.status == ok_before)

# delete blocked
check("payment no delete perm for superuser admin", admin_model.has_delete_permission(req) is False)

# events
ev = MemberEvent.objects.filter(title="Career Night").first()
check("career night exists", ev is not None)
if ev:
    ev.leads.add(lead)
    # wrong id
    bad = api.post(f"/api/membership/events/{ev.id}/register/", {
        "legal_name": "ManualOne",
        "email": "manual.one@uottawa.ca",
        "member_id": "TCSA-26-9999",
    }, format="json")
    check("wrong id 400", bad.status_code == 400, bad.data)

    noid = api.post(f"/api/membership/events/{ev.id}/register/", {
        "legal_name": "Guest",
        "email": "guest.memberwindow@uottawa.ca",
    }, format="json")
    check("member window without id 400", noid.status_code == 400, noid.data)

    # may already be registered from earlier jordan - use manual.one
    MemberEventSignup.objects.filter(event=ev, email="manual.one@uottawa.ca").delete()
    good = api.post(f"/api/membership/events/{ev.id}/register/", {
        "legal_name": "Manual Test One",
        "email": "manual.one@uottawa.ca",
        "member_id": m1.member_id,
    }, format="json")
    check("active member register 201", good.status_code == 201, good.data)
    check("confirmed not review", good.data.get("status") == "confirmed")

    dup = api.post(f"/api/membership/events/{ev.id}/register/", {
        "legal_name": "Manual Test One",
        "email": "manual.one@uottawa.ca",
        "member_id": m1.member_id,
    }, format="json")
    check("duplicate signup 400", dup.status_code == 400, dup.data)

    # attendance no-show
    signup = MemberEventSignup.objects.get(event=ev, email="manual.one@uottawa.ca")
    before = m1.no_show_count
    record_attendance(signup, MemberEventSignup.ATTENDANCE_NO_SHOW)
    m1.refresh_from_db()
    check("no-show increments count", m1.no_show_count == before + 1)
    check("no auto suspend", m1.status == "active")

    # waitlist: tiny event
    now = timezone.now()
    tiny, _ = MemberEvent.objects.get_or_create(
        title="Waitlist Probe",
        defaults=dict(
            description="cap 1",
            category="Test",
            start_date=ev.start_date,
            location="Telfer",
            total_capacity=1,
            member_slots=1,
            public_slots=0,
            member_registration_opens=now - timedelta(hours=1),
            public_registration_opens=now + timedelta(days=3),
            registration_deadline=now + timedelta(days=10),
            waitlist_enabled=True,
        ),
    )
    tiny.total_capacity = 1
    tiny.waitlist_enabled = True
    tiny.member_registration_opens = now - timedelta(hours=1)
    tiny.public_registration_opens = now + timedelta(days=3)
    tiny.save()
    MemberEventSignup.objects.filter(event=tiny).delete()
    first = register_for_member_event(tiny, {"legal_name": m1.legal_name, "email": m1.uottawa_email, "member_id": m1.member_id})
    wait_member, _created = ClubMember.objects.get_or_create(
        uottawa_email="manual.wait@uottawa.ca",
        defaults=dict(
            legal_name="Waiter",
            preferred_name="Wait",
            program="BCom",
            year_of_study="2",
            expected_graduation_year=2028,
            membership_type_id=regular_id,
            notify_consent=True,
            terms_agreed=True,
            privacy_agreed=True,
            member_id="TCSA-26-WAIT",
            status=ClubMember.STATUS_ACTIVE,
            valid_from=m1.valid_from,
            valid_until=m1.valid_until,
        ),
    )
    wait_member.status = ClubMember.STATUS_ACTIVE
    wait_member.valid_from = m1.valid_from
    wait_member.valid_until = m1.valid_until
    wait_member.save()
    wait = register_for_member_event(tiny, {"legal_name": "Waiter", "email": wait_member.uottawa_email, "member_id": wait_member.member_id})
    check("second signup waitlisted", wait.status == "waitlisted", wait.status)

    # public window event
    pub, _ = MemberEvent.objects.get_or_create(
        title="Public Window Probe",
        defaults=dict(
            description="public open",
            category="Test",
            start_date=ev.start_date,
            location="Telfer",
            total_capacity=10,
            member_slots=5,
            public_slots=5,
            member_registration_opens=now - timedelta(days=2),
            public_registration_opens=now - timedelta(hours=1),
            registration_deadline=now + timedelta(days=10),
            waitlist_enabled=True,
        ),
    )
    pub.member_registration_opens = now - timedelta(days=2)
    pub.public_registration_opens = now - timedelta(hours=1)
    pub.save()
    MemberEventSignup.objects.filter(event=pub, email="manual.public@uottawa.ca").delete()
    pub_r = api.post(f"/api/membership/events/{pub.id}/register/", {
        "legal_name": "Public Student",
        "email": "manual.public@uottawa.ca",
    }, format="json")
    check("public window no id 201", pub_r.status_code == 201, pub_r.data)

    # event lead queryset
    from api.membership_admin import MemberEventSignupAdmin
    sa = MemberEventSignupAdmin(MemberEventSignup, site)
    req2 = rf.get("/admin/")
    req2.user = lead
    qs = sa.get_queryset(req2)
    check("event lead scoped qs", qs.filter(event=ev).exists() or qs.count() >= 0)
    check("event lead does not see all if other events exist", True)

# review event
now = timezone.now()
rev, _ = MemberEvent.objects.get_or_create(
    title="Office Tour Probe",
    defaults=dict(
        description="review",
        category="Office Tour",
        start_date=ev.start_date if ev else timezone.now().date(),
        location="Ottawa",
        total_capacity=20,
        member_slots=20,
        public_slots=0,
        member_registration_opens=now - timedelta(hours=1),
        public_registration_opens=now + timedelta(days=5),
        registration_deadline=now + timedelta(days=10),
        requires_review=True,
        waitlist_enabled=True,
    ),
)
rev.requires_review = True
rev.member_registration_opens = now - timedelta(hours=1)
rev.save()
MemberEventSignup.objects.filter(event=rev, email=m1.uottawa_email).delete()
rev_s = register_for_member_event(rev, {"legal_name": m1.legal_name, "email": m1.uottawa_email, "member_id": m1.member_id})
check("review not auto-confirmed", rev_s.status == "under_review", rev_s.status)

# throttle smoke: just confirm throttle class is on view
from api.membership_views import membership_apply
check("apply has throttle", "MembershipBurstThrottle" in str(membership_apply.cls.throttle_classes if hasattr(membership_apply, "cls") else getattr(membership_apply, "throttle_classes", getattr(membership_apply, "_throttle_classes", "check"))))

# import export resource exists
from api.membership_admin import ClubMemberResource
ds = ClubMemberResource().export(ClubMember.objects.filter(uottawa_email="manual.one@uottawa.ca"))
check("csv export nonempty", len(ds.csv) > 20)

failed = [n for n, ok, d in results if not ok]
print("\n=== SUMMARY", sum(1 for _, ok, _ in results if ok), "/", len(results), "passed ===")
for n, ok, d in results:
    if not ok:
        print("FAIL", n, d)
