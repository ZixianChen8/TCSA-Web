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


    

class Department(models.Model): # Assuming Department model is defined as you provided or similar
    code = models.CharField(max_length=10, null=False, unique=True) # Make code unique
    name = models.CharField(max_length=100, null=True, blank=True) # Add a display name
    manager = models.ForeignKey('Member', on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_departments')
    # members = models.ManyToManyField('Member', related_name='member_of_departments', blank=True) # Corrected related_name
    # The 'members' field on Department model as ManyToManyField to Member creates a relationship
    # where a Member can belong to multiple Departments.
    # If a member belongs to only one department, you might put a ForeignKey to Department on the Member model instead.

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
    position = models.CharField(max_length=100, blank=True, null=True) # e.g., "President", "VP Finance", "Media Lead", "Developer"
    description = models.TextField(null=True, blank=True) # General description if needed
    pfp_img = models.ImageField(upload_to='member_pfps/', max_length=200, blank=True, null=True)

    # --- Fields for pyramid structure ---
    reports_to = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='direct_reports' # member.direct_reports.all() gives subordinates
    )
    quote = models.TextField(blank=True, null=True)

    # --- Department Relationship (Member belongs to ONE Department) ---
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL, # Or models.PROTECT if a member must always have a department (and handle deletions carefully)
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