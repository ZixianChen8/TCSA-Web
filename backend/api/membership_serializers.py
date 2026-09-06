from rest_framework import serializers

from .models import MembershipType, MemberEvent, MemberEventSignup


class MembershipTypePublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipType
        fields = ("id", "slug", "name", "price_cad", "valid_from", "valid_until", "is_open")


class MembershipApplySerializer(serializers.Serializer):
    legal_name = serializers.CharField(max_length=200)
    preferred_name = serializers.CharField(max_length=200)
    uottawa_email = serializers.EmailField()
    personal_email = serializers.EmailField(required=False, allow_blank=True)
    wechat_id = serializers.CharField(required=False, allow_blank=True, max_length=100)
    linkedin_url = serializers.URLField(required=False, allow_blank=True)
    program = serializers.CharField(max_length=200)
    year_of_study = serializers.CharField(max_length=20)
    expected_graduation_year = serializers.IntegerField(min_value=2020, max_value=2100)
    membership_type_id = serializers.IntegerField()
    interested_industries = serializers.ListField(
        child=serializers.CharField(max_length=100),
        allow_empty=False,
    )
    preferred_event_types = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        allow_empty=True,
    )
    notify_consent = serializers.BooleanField()
    terms_agreed = serializers.BooleanField()
    privacy_agreed = serializers.BooleanField()


class MembershipLookupSerializer(serializers.Serializer):
    email = serializers.EmailField()


class MemberEventSignupSerializer(serializers.Serializer):
    legal_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    member_id = serializers.CharField(required=False, allow_blank=True, max_length=20)


class MemberEventPublicSerializer(serializers.ModelSerializer):
    registration_status = serializers.SerializerMethodField()
    confirmed_count = serializers.SerializerMethodField()

    class Meta:
        model = MemberEvent
        fields = (
            "id",
            "title",
            "description",
            "category",
            "start_date",
            "end_date",
            "start_time",
            "end_time",
            "location",
            "total_capacity",
            "member_slots",
            "public_slots",
            "member_registration_opens",
            "public_registration_opens",
            "registration_deadline",
            "waitlist_enabled",
            "requires_review",
            "requires_deposit",
            "registration_status",
            "confirmed_count",
        )

    def get_registration_status(self, obj):
        from .membership_services import compute_registration_status

        return compute_registration_status(obj)

    def get_confirmed_count(self, obj):
        from .membership_services import counted_signups

        return counted_signups(obj)
