from django.db import models
from datetime import timedelta
from django.core.validators import MaxLengthValidator

class Event(models.Model):
    title = models.CharField(max_length=200, null=False)
    organizer = models.CharField(max_length=200, null=True, blank = True)
    description = models.TextField(null=True, blank=True)
    start_date = models.DateField(null=False)
    end_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    duration = models.CharField(null=True, blank=True, help_text="Duration of the event")
    location = models.TextField(null=True, blank = True)
    other_link = models.URLField(blank=True, null=True, unique=True)
    poster_img = models.ImageField(upload_to='event_posters/', blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Event"
        verbose_name_plural = "Events"



class Registration(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')

    first_name = models.CharField(max_length=100, null=False)
    last_name = models.CharField(max_length=100, null=False)
    email = models.EmailField(max_length=100, blank=False, null=False)

    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} for {self.event.title}"

    class Meta:
        verbose_name = "Registration"
        verbose_name_plural = "Registrations"
        constraints = [
            models.UniqueConstraint(fields=['event', 'email'], name='unique_event_email_registration')
        ]


    

class Department(models.Model): 
    code = models.CharField(max_length=10, null=False, unique=True) # Make code unique
    name = models.CharField(max_length=100, null=True, blank=True) # Add a display name
    manager = models.ForeignKey('Member', on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_departments')


    def __str__(self):
        return self.name or self.code

    class Meta:
        verbose_name = "Department"
        verbose_name_plural = "Departments"


class Member(models.Model):
    first_name = models.CharField(max_length=100, null=False)
    last_name = models.CharField(max_length=100, null=False)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(max_length=100, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True) 
    description = models.TextField(null=True, blank=True) 
    pfp_img = models.ImageField(upload_to='member_pfps/', max_length=200, blank=True, null=True)

    # ----- fields for pyramid structure -----
    reports_to = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='direct_reports' 
    )
    quote = models.TextField(blank=True, null=True)

    # --- Department Relationship (Member belongs to ONE Department) ---
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL, 
        null=True,                 # Allow member to not be in any department (e.g., CEO, President)
        blank=True,
        related_name='team_members'  # department.team_members.all() gives all members in that department
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        verbose_name = "Member"
        verbose_name_plural = "Members"


class Resource(models.Model):
    title = models.CharField(max_length=200, null=False, unique=True)
    description = models.TextField(null=True, blank=True)
    thumbnail_img = models.ImageField(upload_to='resource_thumbnails/', blank=False, null=False)
    resource_url = models.URLField(blank=True, null=True, unique=True)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = "Resource"
        verbose_name_plural = "Resources"
    
class Sponsor(models.Model):
    name = models.CharField(max_length=200, null=False, unique=True)
    link = models.URLField(blank=True, null=True)
    logo_img = models.ImageField(upload_to='sponsor_logos/', blank=True, null=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Sponsor"
        verbose_name_plural = "Sponsors"
    

# Join Us page hero section (allows only one image)
class JoinUsHeroImage(models.Model):
    title = models.CharField(max_length=200, null=False)
    image = models.ImageField(
        upload_to='join_us_hero/',
        blank=False,
        null=False,
        help_text='Only one Join Us hero image is allowed. Delete the existing one before adding a new one.'
    )
    caption = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = "Join Us Hero Image"
        verbose_name_plural = "Join Us Hero Image"
    

class CircularGalleryImage(models.Model):
    title = models.CharField(max_length=200, null=False)
    image = models.ImageField(upload_to='circular_gallery/', blank=True, null=True)
    caption = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Circular Gallery Image"
        verbose_name_plural = "Circular Gallery Images"


# Resource page carousel images
class ResourceCarouselImage(models.Model):
    title = models.CharField(max_length=200, null=False)
    image = models.ImageField(upload_to='resource_carousel/', blank=True, null=True)
    link = models.URLField(blank=True, null=True, help_text="Optional: Link the image to a resource or external page.")
    caption = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Resource Carousel Image"
        verbose_name_plural = "Resource Carousel Images"

class HomeHeroMedia(models.Model):
    title = models.CharField(max_length=200, null=False)
    image = models.ImageField(upload_to='home_hero/', blank=True, null=True)
    video = models.FileField(upload_to='home_hero/', blank=True, null=True)
    caption = models.TextField(blank=True, null=True)

    def clean(self):
        from django.core.exceptions import ValidationError
        if not self.image and not self.video:
            raise ValidationError('Either an image or a video must be provided.')
        if self.image and self.video:
            raise ValidationError('Only one of image or video should be provided.')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Home Hero Media"
        verbose_name_plural = "Home Hero Media"

# Event page hero section (allows only one image)
class EventHeroImage(models.Model):
    title = models.CharField(max_length=200, null=False)
    image = models.ImageField(
        upload_to='event_hero/',
        blank=False,
        null=False,
        help_text='Only one Event hero image is allowed. Delete the existing one before adding a new one.'
    )
    caption = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Event Hero Image"
        verbose_name_plural = "Event Hero Image"


# Services page hero section (allows only one image)
class ServicesHeroImage(models.Model):
    title = models.CharField(max_length=200, null=False)
    image = models.ImageField(
        upload_to='services_hero/',
        blank=False,
        null=False,
        help_text='Only one Services hero image is allowed. Delete the existing one before adding a new one.'
    )
    caption = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Services Hero Image"
        verbose_name_plural = "Services Hero Image"

# Resource page hero section (allows only one image)
class ResourceHeroImage(models.Model):
    title = models.CharField(max_length=200, null=False)
    image = models.ImageField(
        upload_to='resource_hero/',
        blank=False,
        null=False,
        help_text='Only one Resource hero image is allowed. Delete the existing one before adding a new one.'
    )
    caption = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Resource Hero Image"
        verbose_name_plural = "Resource Hero Image"

class ServicesBgImage(models.Model):
    title = models.CharField(max_length=200, null=False)
    image = models.ImageField(upload_to='services_bg/', blank=False, null=False)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Services Background Image"
        verbose_name_plural = "Services Background Images"


# Benefit background images (allows up to 3 images)
class BenefitBgImage(models.Model):
    title = models.CharField(max_length=200, null=False)
    image = models.ImageField(upload_to='benefit_bg/', blank=False, null=False)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Benefit Background Image"
        verbose_name_plural = "Benefit Background Images"



# Alumni page hero section (allows only one image)
class AlumniHeroImage(models.Model):
    title = models.CharField(max_length=200, null=False)
    image = models.ImageField(
        upload_to='alumni_hero/',
        blank=False,
        null=False,
        help_text='Only one Alumni hero image is allowed. Delete the existing one before adding a new one.'
    )
    caption = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Alumni Hero Image"
        verbose_name_plural = "Alumni Hero Image"


# Alumni model for club alumni
class ClubAlumnus(models.Model):
    name = models.CharField(max_length=200, null=False)
    position = models.CharField(max_length=100, blank=True, null=True)
    major = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(max_length=100, blank=True, null=True)
    pfp_img = models.ImageField(upload_to='alumni_profiles/', blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Club Alumnus"
        verbose_name_plural = "Club Alumni"


# Telfer alumni model
class TelferAlumnus(models.Model):
    name = models.CharField(max_length=200, null=False)
    major = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(max_length=100, blank=True, null=True)
    pfp_img = models.ImageField(upload_to='telfer_alumni_profiles/', blank=True, null=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Telfer Alumnus"
        verbose_name_plural = "Telfer Alumni"




# Open positions that users can apply for
class OpenPosition(models.Model):
    title = models.CharField(max_length=200, null=False, help_text="Position title")
    description = models.TextField(
        null=False,
        help_text="Reminder to list down important things you want the applicant to include in their resume",
        validators=[MaxLengthValidator(400)]
    )
    posted_at = models.DateField(help_text="Datetime when the position was posted")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Open Position"
        verbose_name_plural = "Open Positions"



# Navbar logo for the website

class NavbarLogo(models.Model):
    title = models.CharField(max_length=200, null=False)
    logo = models.ImageField(upload_to='navbar_logo/', blank=False, null=False)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Navbar Logo"
        verbose_name_plural = "Navbar Logos"

class Design(models.Model):
    title = models.CharField(max_length=200, null=False)
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='designs/', max_length=500, null=False, blank=False)
    type = models.CharField(max_length=100, null=False)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Design"
        verbose_name_plural = "Designs"


# ---------------------------------------------------------------------------
# Paid membership (do not reuse Member / Event / Registration)
# ---------------------------------------------------------------------------

class MembershipType(models.Model):
    slug = models.SlugField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    price_cad = models.DecimalField(max_digits=8, decimal_places=2)
    valid_from = models.DateField(null=True, blank=True)
    valid_until = models.DateField(null=True, blank=True)
    is_open = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} (CAD ${self.price_cad})"

    class Meta:
        verbose_name = "Membership type"
        verbose_name_plural = "Membership types"
        ordering = ["price_cad"]


class MembershipSettings(models.Model):
    """Singleton: Interac payee details shown after apply."""

    payee_name = models.CharField(max_length=200, default="TCSA")
    interac_email = models.EmailField(blank=True)
    interac_phone = models.CharField(max_length=40, blank=True)
    instruction_text = models.TextField(
        blank=True,
        default=(
            "Send an Interac e-transfer for the exact amount. "
            "Put your member ID in the memo so VP Finance can match your payment."
        ),
    )
    contact_email = models.EmailField(blank=True, default="membership@tcsaofficial.com")

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Membership settings"

    class Meta:
        verbose_name = "Membership settings"
        verbose_name_plural = "Membership settings"


class ClubMember(models.Model):
    STATUS_PENDING = "pending"
    STATUS_ACTIVE = "active"
    STATUS_PAYMENT_REVIEW = "payment_review"
    STATUS_SUSPENDED = "suspended"
    STATUS_EXPIRED = "expired"
    STATUS_REFUNDED = "refunded"
    STATUS_CANCELLED = "cancelled"
    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_ACTIVE, "Active"),
        (STATUS_PAYMENT_REVIEW, "Payment Review"),
        (STATUS_SUSPENDED, "Suspended"),
        (STATUS_EXPIRED, "Expired"),
        (STATUS_REFUNDED, "Refunded"),
        (STATUS_CANCELLED, "Cancelled"),
    ]
    BLOCKING_STATUSES = (
        STATUS_PENDING,
        STATUS_ACTIVE,
        STATUS_PAYMENT_REVIEW,
        STATUS_SUSPENDED,
    )

    legal_name = models.CharField(max_length=200)
    preferred_name = models.CharField(max_length=200)
    uottawa_email = models.EmailField()
    personal_email = models.EmailField(blank=True)
    wechat_id = models.CharField(max_length=100, blank=True)
    linkedin_url = models.URLField(blank=True)
    program = models.CharField(max_length=200)
    year_of_study = models.CharField(max_length=20)
    expected_graduation_year = models.PositiveIntegerField()
    membership_type = models.ForeignKey(
        MembershipType,
        on_delete=models.PROTECT,
        related_name="members",
    )
    interested_industries = models.JSONField(default=list, blank=True)
    preferred_event_types = models.JSONField(default=list, blank=True)
    notify_consent = models.BooleanField(default=False)
    terms_agreed = models.BooleanField(default=False)
    privacy_agreed = models.BooleanField(default=False)
    member_id = models.CharField(max_length=20, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    valid_from = models.DateField(null=True, blank=True)
    valid_until = models.DateField(null=True, blank=True)
    no_show_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.member_id} — {self.preferred_name}"

    class Meta:
        verbose_name = "Club member"
        verbose_name_plural = "Club members"
        constraints = [
            models.UniqueConstraint(
                fields=["uottawa_email"],
                condition=models.Q(status__in=["pending", "active", "payment_review", "suspended"]),
                name="unique_blocking_uottawa_email",
            )
        ]


class MembershipApplication(models.Model):
    club_member = models.OneToOneField(
        ClubMember,
        on_delete=models.CASCADE,
        related_name="application",
    )
    application_ref = models.CharField(max_length=20, unique=True)
    form_snapshot = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.application_ref

    class Meta:
        verbose_name = "Membership application"
        verbose_name_plural = "Membership applications"


class MembershipPayment(models.Model):
    METHOD_ETRANSFER = "etransfer"
    METHOD_CHOICES = [(METHOD_ETRANSFER, "Interac e-transfer")]

    STATUS_AWAITING = "awaiting"
    STATUS_CONFIRMED = "confirmed"
    STATUS_MISMATCH = "mismatch"
    STATUS_REFUNDED = "refunded"
    STATUS_CHOICES = [
        (STATUS_AWAITING, "Awaiting"),
        (STATUS_CONFIRMED, "Confirmed"),
        (STATUS_MISMATCH, "Mismatch"),
        (STATUS_REFUNDED, "Refunded"),
    ]

    club_member = models.ForeignKey(
        ClubMember,
        on_delete=models.CASCADE,
        related_name="payments",
    )
    application = models.ForeignKey(
        MembershipApplication,
        on_delete=models.CASCADE,
        related_name="payments",
    )
    amount_expected = models.DecimalField(max_digits=8, decimal_places=2)
    amount_received = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    method = models.CharField(max_length=20, choices=METHOD_CHOICES, default=METHOD_ETRANSFER)
    interac_reference = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_AWAITING)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    confirmed_by = models.ForeignKey(
        "auth.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="confirmed_membership_payments",
    )
    refund_amount = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    refund_reason = models.TextField(blank=True)
    refunded_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.interac_reference} ({self.status})"

    class Meta:
        verbose_name = "Membership payment"
        verbose_name_plural = "Membership payments"


class MembershipStatusLog(models.Model):
    club_member = models.ForeignKey(
        ClubMember,
        on_delete=models.CASCADE,
        related_name="status_logs",
    )
    from_status = models.CharField(max_length=20)
    to_status = models.CharField(max_length=20)
    actor = models.ForeignKey(
        "auth.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="membership_status_changes",
    )
    reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.club_member.member_id}: {self.from_status} → {self.to_status}"

    class Meta:
        verbose_name = "Membership status log"
        verbose_name_plural = "Membership status logs"
        ordering = ["-created_at"]


class MemberEvent(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    location = models.TextField(blank=True)
    total_capacity = models.PositiveIntegerField(default=0)
    member_slots = models.PositiveIntegerField(default=0)
    public_slots = models.PositiveIntegerField(default=0)
    staff_slots = models.PositiveIntegerField(default=0)
    member_registration_opens = models.DateTimeField(null=True, blank=True)
    public_registration_opens = models.DateTimeField(null=True, blank=True)
    registration_deadline = models.DateTimeField(null=True, blank=True)
    waitlist_enabled = models.BooleanField(default=True)
    requires_review = models.BooleanField(default=False)
    requires_deposit = models.BooleanField(default=False)
    is_cancelled = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    leads = models.ManyToManyField(
        "auth.User",
        blank=True,
        related_name="led_member_events",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Member event"
        verbose_name_plural = "Member events"
        ordering = ["start_date"]


class MemberEventSignup(models.Model):
    STATUS_SUBMITTED = "submitted"
    STATUS_UNDER_REVIEW = "under_review"
    STATUS_CONFIRMED = "confirmed"
    STATUS_WAITLISTED = "waitlisted"
    STATUS_DECLINED = "declined"
    STATUS_CANCELLED = "cancelled"
    STATUS_ATTENDED = "attended"
    STATUS_NO_SHOW = "no_show"
    STATUS_CHOICES = [
        (STATUS_SUBMITTED, "Submitted"),
        (STATUS_UNDER_REVIEW, "Under Review"),
        (STATUS_CONFIRMED, "Confirmed"),
        (STATUS_WAITLISTED, "Waitlisted"),
        (STATUS_DECLINED, "Declined"),
        (STATUS_CANCELLED, "Cancelled"),
        (STATUS_ATTENDED, "Attended"),
        (STATUS_NO_SHOW, "No-show"),
    ]

    ATTENDANCE_NONE = ""
    ATTENDANCE_ATTENDED = "attended"
    ATTENDANCE_CANCELLED_ON_TIME = "cancelled_on_time"
    ATTENDANCE_LATE_CANCEL = "late_cancel"
    ATTENDANCE_NO_SHOW = "no_show"
    ATTENDANCE_EXCUSED = "excused"
    ATTENDANCE_CHOICES = [
        (ATTENDANCE_NONE, "—"),
        (ATTENDANCE_ATTENDED, "Attended"),
        (ATTENDANCE_CANCELLED_ON_TIME, "Cancelled on time"),
        (ATTENDANCE_LATE_CANCEL, "Late cancellation"),
        (ATTENDANCE_NO_SHOW, "No-show"),
        (ATTENDANCE_EXCUSED, "Excused absence"),
    ]

    event = models.ForeignKey(
        MemberEvent,
        on_delete=models.CASCADE,
        related_name="signups",
    )
    club_member = models.ForeignKey(
        ClubMember,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="event_signups",
    )
    legal_name = models.CharField(max_length=200)
    email = models.EmailField()
    member_id_entered = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_SUBMITTED)
    attendance = models.CharField(
        max_length=30,
        choices=ATTENDANCE_CHOICES,
        blank=True,
        default=ATTENDANCE_NONE,
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email} → {self.event.title}"

    class Meta:
        verbose_name = "Member event signup"
        verbose_name_plural = "Member event signups"
        constraints = [
            models.UniqueConstraint(
                fields=["event", "email"],
                name="unique_member_event_email_signup",
            )
        ]