from datetime import date, timedelta

from django.contrib.auth.models import User
from django.core import mail
from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework.test import APIClient

from .models import (
    ClubMember,
    MembershipPayment,
    MembershipStatusLog,
    MembershipType,
    MemberEvent,
    MemberEventSignup,
)
from .membership_services import (
    REG_MEMBER_OPEN,
    REG_PUBLIC_OPEN,
    REG_WAITLIST,
    apply_for_membership,
    compute_registration_status,
    confirm_payment,
    refund_payment,
    register_for_member_event,
)


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
class MembershipTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.mtype = MembershipType.objects.create(
            slug="regular-test",
            name="Regular Membership",
            price_cad="25.00",
            valid_from=date(2026, 9, 1),
            valid_until=date(2027, 8, 31),
            is_open=True,
        )
        self.finance = User.objects.create_user("finance", password="pass")
        self.payload = {
            "legal_name": "Alex Student",
            "preferred_name": "Alex",
            "uottawa_email": "alex@uottawa.ca",
            "program": "BCom",
            "year_of_study": "2",
            "expected_graduation_year": 2028,
            "membership_type_id": self.mtype.id,
            "interested_industries": ["Finance"],
            "notify_consent": True,
            "terms_agreed": True,
            "privacy_agreed": True,
        }

    def test_apply_creates_pending_member_and_id(self):
        res = self.client.post("/api/membership/apply/", self.payload, format="json")
        self.assertEqual(res.status_code, 201, res.data)
        self.assertTrue(res.data["member_id"].startswith("TCSA-"))
        member = ClubMember.objects.get(uottawa_email="alex@uottawa.ca")
        self.assertEqual(member.status, ClubMember.STATUS_PENDING)
        self.assertEqual(member.payments.first().status, MembershipPayment.STATUS_AWAITING)
        self.assertEqual(len(mail.outbox), 1)

    def test_duplicate_email_rejected(self):
        self.assertEqual(self.client.post("/api/membership/apply/", self.payload, format="json").status_code, 201)
        res = self.client.post("/api/membership/apply/", self.payload, format="json")
        self.assertEqual(res.status_code, 400)

    def test_member_ids_are_unique_and_sequential(self):
        apply_for_membership(self.payload)
        second = dict(self.payload)
        second["uottawa_email"] = "blake@uottawa.ca"
        second["legal_name"] = "Blake"
        a = ClubMember.objects.get(uottawa_email="alex@uottawa.ca")
        b, _, _ = apply_for_membership(second)
        self.assertNotEqual(a.member_id, b.member_id)
        self.assertEqual(ClubMember.objects.count(), 2)

    def test_confirm_payment_activates_and_logs(self):
        member, _, payment = apply_for_membership(self.payload)
        confirm_payment(payment, actor=self.finance)
        member.refresh_from_db()
        self.assertEqual(member.status, ClubMember.STATUS_ACTIVE)
        log = MembershipStatusLog.objects.filter(club_member=member, to_status=ClubMember.STATUS_ACTIVE).first()
        self.assertIsNotNone(log)
        self.assertEqual(log.actor, self.finance)
        self.assertTrue(any("active" in m.subject.lower() for m in mail.outbox))

    def test_refund_marks_refunded(self):
        member, _, payment = apply_for_membership(self.payload)
        confirm_payment(payment, actor=self.finance)
        refund_payment(payment, actor=self.finance, reason="Requested")
        member.refresh_from_db()
        payment.refresh_from_db()
        self.assertEqual(member.status, ClubMember.STATUS_REFUNDED)
        self.assertEqual(payment.status, MembershipPayment.STATUS_REFUNDED)

    def test_lookup_always_same_message(self):
        known = self.client.post("/api/membership/lookup/", {"email": "alex@uottawa.ca"}, format="json")
        unknown = self.client.post("/api/membership/lookup/", {"email": "nobody@uottawa.ca"}, format="json")
        self.assertEqual(known.data["message"], unknown.data["message"])

    def _event(self, **kwargs):
        now = timezone.now()
        defaults = {
            "title": "Office Tour",
            "start_date": date.today() + timedelta(days=10),
            "location": "Telfer",
            "total_capacity": 2,
            "member_slots": 2,
            "public_slots": 1,
            "member_registration_opens": now - timedelta(hours=1),
            "public_registration_opens": now + timedelta(days=2),
            "registration_deadline": now + timedelta(days=9),
            "waitlist_enabled": True,
            "requires_review": False,
        }
        defaults.update(kwargs)
        return MemberEvent.objects.create(**defaults)

    def _active_member(self, email="alex@uottawa.ca"):
        payload = dict(self.payload)
        payload["uottawa_email"] = email
        member, _, payment = apply_for_membership(payload)
        confirm_payment(payment, actor=self.finance)
        member.refresh_from_db()
        return member

    def test_member_priority_window_rejects_non_member(self):
        event = self._event()
        self.assertEqual(compute_registration_status(event), REG_MEMBER_OPEN)
        with self.assertRaises(ValueError):
            register_for_member_event(event, {
                "legal_name": "Guest",
                "email": "guest@uottawa.ca",
            })

    def test_wrong_id_rejected(self):
        member = self._active_member()
        event = self._event()
        with self.assertRaises(ValueError):
            register_for_member_event(event, {
                "legal_name": member.legal_name,
                "email": member.uottawa_email,
                "member_id": "TCSA-26-9999",
            })

    def test_active_member_can_register_in_priority_window(self):
        member = self._active_member()
        event = self._event()
        signup = register_for_member_event(event, {
            "legal_name": member.legal_name,
            "email": member.uottawa_email,
            "member_id": member.member_id,
        })
        self.assertEqual(signup.status, MemberEventSignup.STATUS_CONFIRMED)

    def test_capacity_goes_to_waitlist(self):
        event = self._event(total_capacity=1)
        first = self._active_member("one@uottawa.ca")
        second = self._active_member("two@uottawa.ca")
        register_for_member_event(event, {
            "legal_name": first.legal_name,
            "email": first.uottawa_email,
            "member_id": first.member_id,
        })
        wait = register_for_member_event(event, {
            "legal_name": second.legal_name,
            "email": second.uottawa_email,
            "member_id": second.member_id,
        })
        self.assertEqual(wait.status, MemberEventSignup.STATUS_WAITLISTED)
        self.assertEqual(compute_registration_status(event), REG_WAITLIST)

    def test_review_event_not_auto_confirmed(self):
        member = self._active_member()
        event = self._event(requires_review=True)
        signup = register_for_member_event(event, {
            "legal_name": member.legal_name,
            "email": member.uottawa_email,
            "member_id": member.member_id,
        })
        self.assertEqual(signup.status, MemberEventSignup.STATUS_UNDER_REVIEW)

    def test_public_window_allows_without_id(self):
        now = timezone.now()
        event = self._event(
            member_registration_opens=now - timedelta(days=2),
            public_registration_opens=now - timedelta(hours=1),
        )
        self.assertEqual(compute_registration_status(event), REG_PUBLIC_OPEN)
        signup = register_for_member_event(event, {
            "legal_name": "Public Student",
            "email": "public@uottawa.ca",
        })
        self.assertEqual(signup.status, MemberEventSignup.STATUS_CONFIRMED)

    def test_config_lists_open_types(self):
        res = self.client.get("/api/membership/config/")
        self.assertEqual(res.status_code, 200)
        slugs = [row["slug"] for row in res.data["types"]]
        self.assertIn("regular-test", slugs)
