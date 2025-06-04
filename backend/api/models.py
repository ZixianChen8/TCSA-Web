from django.db import models

class Event(models.Model):
    title = models.CharField(max_length=200, null=False)
    organizer = models.CharField(max_length=200, null=True, blank = True)
    description = models.TextField(null=True, blank=True)
    start_date = models.DateField(null=False)
    end_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    location = models.TextField(null=True, blank = True)
    other_link = models.URLField(blank=True, null=True, unique=True)
    poster_link = models.URLField(blank=True)

    def __str__(self):
        return self.title


class Registration(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')

    first_name = models.CharField(max_length=100, null=False)
    last_name = models.CharField(max_length=100, null=False)
    email = models.EmailField(max_length=100, blank=False, null=False)

    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} for {self.event.title}"

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['event', 'email'], name='unique_event_email_registration')
        ]
        


class BgMedia(models.Model):
    title = models.CharField(max_length=200, null=False, unique=True)
    link = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title

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


class Member(models.Model):
    first_name = models.CharField(max_length=100, null=False)
    last_name = models.CharField(max_length=100, null=False)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(max_length=100, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True) # e.g., "President", "VP Finance", "Media Lead", "Developer"
    description = models.TextField(null=True, blank=True) # General description if needed
    pfp_url = models.URLField(max_length=200, blank=True, null=True)

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


class Resource(models.Model):
    title = models.CharField(max_length=200, null=False, unique=True)
    description = models.TextField(null=True, blank=True)
    thumbnail_url = models.URLField(blank=True, null=True)
    resource_url = models.URLField(blank=True, null=True, unique=True)

    def __str__(self):
        return self.title
    
class Sponsor(models.Model):
    name = models.CharField(max_length=200, null=False, unique=True)
    link = models.URLField(blank=True, null=True)
    logo = models.URLField(blank=True, null=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name
    
