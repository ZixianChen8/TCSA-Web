from django import forms
from django.contrib import admin, messages
from import_export.admin import ExportMixin
from import_export import resources

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
from .membership_email import send_activation_email
from .membership_services import (
    change_member_status,
    confirm_payment,
    flag_payment_mismatch,
    record_attendance,
    refund_payment,
)

GROUP_COORDINATOR = "Membership Coordinator"
GROUP_FINANCE = "VP Finance"
GROUP_EVENT_LEAD = "Event Lead"


def _in_group(user, name):
    return user.is_superuser or user.groups.filter(name=name).exists()


class ClubMemberResource(resources.ModelResource):
    class Meta:
        model = ClubMember
        fields = (
            "member_id",
            "legal_name",
            "preferred_name",
            "uottawa_email",
            "status",
            "membership_type__name",
            "program",
            "year_of_study",
            "expected_graduation_year",
            "no_show_count",
            "valid_from",
            "valid_until",
        )


class MembershipPaymentResource(resources.ModelResource):
    class Meta:
        model = MembershipPayment
        fields = (
            "interac_reference",
            "club_member__member_id",
            "club_member__uottawa_email",
            "amount_expected",
            "amount_received",
            "status",
            "confirmed_at",
            "refund_amount",
            "refund_reason",
        )


class MemberEventSignupResource(resources.ModelResource):
    class Meta:
        model = MemberEventSignup
        fields = (
            "event__title",
            "legal_name",
            "email",
            "member_id_entered",
            "status",
            "attendance",
            "created_at",
        )


class ClubMemberAdminForm(forms.ModelForm):
    status_reason = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={"rows": 2}),
        help_text="Required when changing status.",
    )

    class Meta:
        model = ClubMember
        fields = "__all__"


class MembershipStatusLogInline(admin.TabularInline):
    model = MembershipStatusLog
    extra = 0
    readonly_fields = ("from_status", "to_status", "actor", "reason", "created_at")
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


class MembershipPaymentInline(admin.TabularInline):
    model = MembershipPayment
    extra = 0
    readonly_fields = (
        "amount_expected",
        "amount_received",
        "method",
        "interac_reference",
        "status",
        "confirmed_at",
        "confirmed_by",
    )
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(MembershipType)
class MembershipTypeAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "price_cad", "valid_from", "valid_until", "is_open")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(MembershipSettings)
class MembershipSettingsAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not MembershipSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(ClubMember)
class ClubMemberAdmin(ExportMixin, admin.ModelAdmin):
    form = ClubMemberAdminForm
    resource_class = ClubMemberResource
    list_display = (
        "member_id",
        "preferred_name",
        "uottawa_email",
        "status",
        "membership_type",
        "program",
        "year_of_study",
        "no_show_count",
    )
    list_filter = ("status", "membership_type", "program", "year_of_study")
    search_fields = ("member_id", "legal_name", "preferred_name", "uottawa_email")
    readonly_fields = ("member_id", "created_at", "updated_at", "no_show_count")
    inlines = [MembershipPaymentInline, MembershipStatusLogInline]
    actions = ["resend_activation_email"]

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if _in_group(request.user, GROUP_EVENT_LEAD) and not (
            _in_group(request.user, GROUP_COORDINATOR) or _in_group(request.user, GROUP_FINANCE)
        ):
            return qs.filter(event_signups__event__leads=request.user).distinct()
        return qs

    def has_module_permission(self, request):
        if _in_group(request.user, GROUP_EVENT_LEAD) and not (
            request.user.is_superuser
            or _in_group(request.user, GROUP_COORDINATOR)
            or _in_group(request.user, GROUP_FINANCE)
        ):
            return False
        return super().has_module_permission(request)

    def save_model(self, request, obj, form, change):
        if change:
            previous = ClubMember.objects.get(pk=obj.pk)
            new_status = form.cleaned_data.get("status")
            if previous.status != new_status:
                reason = form.cleaned_data.get("status_reason") or ""
                if not reason:
                    self.message_user(request, "A reason is required to change status.", level=messages.ERROR)
                    obj.status = previous.status
                    super().save_model(request, obj, form, change)
                    return
                obj.status = previous.status
                super().save_model(request, obj, form, change)
                change_member_status(obj, new_status, actor=request.user, reason=reason)
                return
        super().save_model(request, obj, form, change)

    @admin.action(description="Resend activation email")
    def resend_activation_email(self, request, queryset):
        sent = 0
        for member in queryset:
            if send_activation_email(member):
                sent += 1
        self.message_user(request, f"Tried to send {queryset.count()} email(s); {sent} succeeded.")


@admin.register(MembershipApplication)
class MembershipApplicationAdmin(admin.ModelAdmin):
    list_display = ("application_ref", "club_member", "created_at")
    search_fields = ("application_ref", "club_member__member_id", "club_member__uottawa_email")
    readonly_fields = ("application_ref", "club_member", "form_snapshot", "created_at")


@admin.register(MembershipPayment)
class MembershipPaymentAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = MembershipPaymentResource
    list_display = (
        "interac_reference",
        "club_member",
        "amount_expected",
        "amount_received",
        "status",
        "confirmed_at",
    )
    list_filter = ("status", "method")
    search_fields = ("interac_reference", "club_member__member_id", "club_member__uottawa_email")
    actions = ["confirm_selected", "flag_mismatch", "mark_refunded"]

    def get_readonly_fields(self, request, obj=None):
        base = [
            "club_member",
            "application",
            "method",
            "interac_reference",
            "confirmed_at",
            "confirmed_by",
            "created_at",
        ]
        if _in_group(request.user, GROUP_FINANCE) or request.user.is_superuser:
            return base
        return base + [
            "amount_expected",
            "amount_received",
            "refund_amount",
            "refund_reason",
            "status",
        ]

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return request.user.is_superuser

    def _finance_only(self, request):
        if not (_in_group(request.user, GROUP_FINANCE) or request.user.is_superuser):
            self.message_user(request, "Only VP Finance can change payment records.", level=messages.ERROR)
            return False
        return True

    @admin.action(description="Confirm payment and activate membership")
    def confirm_selected(self, request, queryset):
        if not self._finance_only(request):
            return
        for payment in queryset:
            confirm_payment(payment, actor=request.user)
        self.message_user(request, f"Confirmed {queryset.count()} payment(s).")

    @admin.action(description="Flag payment mismatch")
    def flag_mismatch(self, request, queryset):
        if not self._finance_only(request):
            return
        for payment in queryset:
            flag_payment_mismatch(payment, actor=request.user)
        self.message_user(request, f"Flagged {queryset.count()} payment(s).")

    @admin.action(description="Mark refunded")
    def mark_refunded(self, request, queryset):
        if not self._finance_only(request):
            return
        for payment in queryset:
            refund_payment(payment, actor=request.user)
        self.message_user(request, f"Refunded {queryset.count()} payment(s).")


@admin.register(MembershipStatusLog)
class MembershipStatusLogAdmin(admin.ModelAdmin):
    list_display = ("club_member", "from_status", "to_status", "actor", "created_at")
    list_filter = ("to_status",)
    search_fields = ("club_member__member_id",)
    readonly_fields = ("club_member", "from_status", "to_status", "actor", "reason", "created_at")

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


class MemberEventSignupInline(admin.TabularInline):
    model = MemberEventSignup
    extra = 0
    fields = ("legal_name", "email", "member_id_entered", "status", "attendance", "created_at")
    readonly_fields = ("created_at",)


@admin.register(MemberEvent)
class MemberEventAdmin(admin.ModelAdmin):
    list_display = ("title", "start_date", "location", "total_capacity", "requires_review", "is_cancelled")
    list_filter = ("requires_review", "is_cancelled", "is_completed")
    search_fields = ("title", "location")
    filter_horizontal = ("leads",)
    inlines = [MemberEventSignupInline]

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser or _in_group(request.user, GROUP_COORDINATOR):
            return qs
        if _in_group(request.user, GROUP_EVENT_LEAD):
            return qs.filter(leads=request.user)
        return qs.none()


@admin.register(MemberEventSignup)
class MemberEventSignupAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = MemberEventSignupResource
    list_display = ("event", "legal_name", "email", "member_id_entered", "status", "attendance")
    list_filter = ("status", "attendance", "event")
    search_fields = ("email", "legal_name", "member_id_entered", "event__title")
    list_editable = ("status", "attendance")

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser or _in_group(request.user, GROUP_COORDINATOR):
            return qs
        if _in_group(request.user, GROUP_EVENT_LEAD):
            return qs.filter(event__leads=request.user)
        return qs.none()

    def save_model(self, request, obj, form, change):
        if change and "attendance" in form.changed_data:
            record_attendance(obj, form.cleaned_data.get("attendance"), actor=request.user)
            return
        super().save_model(request, obj, form, change)
