from django.contrib import admin
from django.contrib import messages
from django import forms
from django.core.exceptions import ValidationError
from .models import (
    Event,
    Registration,
    Department,
    Member,
    Resource,
    Sponsor,
    JoinUsHeroImage,
    CircularGalleryImage,
    ResourceCarouselImage,
    HomeHeroMedia,
    EventHeroImage,
    ServicesHeroImage,
    ServicesBgImage,
    AlumniHeroImage,
    ClubAlumnus,
    TelferAlumnus,
    NavbarLogo,
    ResourceHeroImage,
    OpenPosition,
    BenefitBgImage,
    Design,
)

# Custom form for Member with validation rules
class MemberAdminForm(forms.ModelForm):
    class Meta:
        model = Member
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # If the reports_to field isn't included, skip custom logic
        if 'reports_to' not in self.fields:
            return
        # President cannot report to anyone: disable the field
        if self.instance and self.instance.position == 'President':
            self.fields['reports_to'].disabled = True
        # Vice President reports only to President
        if self.instance and self.instance.position == 'Vice President':
            self.fields['reports_to'].queryset = Member.objects.filter(position='President')

    def clean_reports_to(self):
        position = self.cleaned_data.get('position')
        reports_to = self.cleaned_data.get('reports_to')
        if position == 'President' and reports_to is not None:
            raise ValidationError("President cannot report to anyone.")
        if position == 'Vice President':
            if reports_to is None:
                raise ValidationError("Vice President must report to the President.")
            if reports_to.position != 'President':
                raise ValidationError("Vice President can only report to President.")
        return reports_to

    def clean(self):
        cleaned_data = super().clean()
        reports_to = cleaned_data.get('reports_to')
        # Only one finance member under VP Finance
        if reports_to and reports_to.position == 'VP Finance':
            # Count existing finance members excluding this instance
            existing = Member.objects.filter(reports_to=reports_to)
            if self.instance.pk:
                existing = existing.exclude(pk=self.instance.pk)
            if existing.exists():
                raise ValidationError("Only one finance member allowed under VP Finance.")
        return cleaned_data

# This inline class allows you to see and manage registrations 
# directly on the detail page of the event they belong to.
class RegistrationInline(admin.TabularInline):
    model = Registration
    # Don't show extra empty forms by default
    extra = 0  
    # Define which fields to show in the inline view
    fields = ('first_name', 'last_name', 'email', 'registered_at')
    # Make the registration timestamp read-only, as it's set automatically
    readonly_fields = ('registered_at',)
    # Allow deleting a registration from the event page
    can_delete = True
    # Add a title to the inline section
    verbose_name_plural = 'Registrations for this Event'


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'start_date', 'location', 'organizer')
    list_filter = ('start_date', 'organizer')
    search_fields = ('title', 'description', 'location')
    # Add the registration inline to the Event admin page
    inlines = [RegistrationInline]


@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    # This provides a separate, detailed view for all registrations
    list_display = ('event', 'first_name', 'last_name', 'email', 'registered_at')
    list_filter = ('event', 'registered_at')
    search_fields = ('first_name', 'last_name', 'email', 'event__title')


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'manager')
    search_fields = ('name', 'code')

    def has_delete_permission(self, request, obj=None):
        if obj and obj.team_members.exists():
            self.message_user(request, "Cannot delete a department that still has members.", level=messages.ERROR)
            return False
        return super().has_delete_permission(request, obj)


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    form = MemberAdminForm
    list_display = ('first_name', 'last_name', 'position', 'department', 'reports_to')
    list_filter = ('department', 'position')
    search_fields = ('first_name', 'last_name', 'email', 'position')

    def has_delete_permission(self, request, obj=None):
        if obj and obj.direct_reports.exists():
            self.message_user(request, "Cannot delete a member who still has direct reports.", level=messages.ERROR)
            return False
        return super().has_delete_permission(request, obj)

    def get_readonly_fields(self, request, obj=None):
        readonly = super().get_readonly_fields(request, obj)
        if obj and obj.position == 'President':
            return readonly + ('department', 'reports_to')
        if obj and obj.position == 'Vice President':
            return readonly + ('department',)
        return readonly

    def save_model(self, request, obj, form, change):
        if obj.position in ['President', 'Vice President']:
            obj.department = None
        super().save_model(request, obj, form, change)


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'thumbnail_img', 'resource_url')
    search_fields = ('title', 'description')


@admin.register(Sponsor)
class SponsorAdmin(admin.ModelAdmin):
    list_display = ('name', 'link', 'logo_img')
    search_fields = ('name',)


# Additional admin registrations for other models
@admin.register(JoinUsHeroImage)
class JoinUsHeroImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'caption', 'image')
    search_fields = ('title', 'caption')

    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)

@admin.register(CircularGalleryImage)
class CircularGalleryImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'caption', 'image')
    search_fields = ('title', 'caption')

@admin.register(ResourceCarouselImage)
class ResourceCarouselImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'link', 'image')
    search_fields = ('title', 'link')


@admin.register(ResourceHeroImage)
class ResourceHeroImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'caption', 'image')
    search_fields = ('title', 'caption')

    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)


@admin.register(BenefitBgImage)
class BenefitBgImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'image')
    search_fields = ('title',)

@admin.register(HomeHeroMedia)
class HomeHeroMediaAdmin(admin.ModelAdmin):
    list_display = ('title', 'image', 'video')
    search_fields = ('title',)

    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)

@admin.register(EventHeroImage)
class EventHeroImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'caption', 'image')
    search_fields = ('title', 'caption')

    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)

@admin.register(ServicesHeroImage)
class ServicesHeroImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'caption', 'image')
    search_fields = ('title', 'caption')

    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)

@admin.register(ServicesBgImage)
class ServicesBgImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'image')
    search_fields = ('title',)

@admin.register(AlumniHeroImage)
class AlumniHeroImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'caption', 'image')
    search_fields = ('title', 'caption')

    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)

@admin.register(ClubAlumnus)
class ClubAlumnusAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'major', 'email')
    search_fields = ('name', 'position', 'major', 'email')

@admin.register(TelferAlumnus)
class TelferAlumnusAdmin(admin.ModelAdmin):
    list_display = ('name', 'major', 'email')
    search_fields = ('name', 'major', 'email')

@admin.register(NavbarLogo)
class NavbarLogoAdmin(admin.ModelAdmin):
    list_display = ('title', 'logo')
    search_fields = ('title',)

@admin.register(OpenPosition)
class OpenPositionAdmin(admin.ModelAdmin):
    list_display = ('title', 'posted_at')
    list_editable = ('posted_at',)
    search_fields = ('title',)

@admin.register(Design)
class DesignAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'image')
    search_fields = ('title', 'type')
