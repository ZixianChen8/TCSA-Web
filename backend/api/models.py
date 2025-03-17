from django.db import models

class Participant(models.Model):
    first_name = models.CharField(max_length=100, null=False)
    last_name = models.CharField(max_length=100, null=False)
    email = models.EmailField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Event(models.Model):
    title = models.CharField(max_length=200, null=False, unique=True)
    organizer = models.CharField(max_length=200, null=True)

    description = models.TextField(null=True, blank=True)

    start_date = models.DateField(null=False)
    end_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)

    location = models.TextField(null=True)
    link = models.URLField(blank=True, null=True, unique=True)
    thumbnail_link = models.URLField(blank=True)
    
    participants = models.ManyToManyField(Participant, blank=True)

    def __str__(self):
        return self.title


class BgMedia(models.Model):
    title = models.CharField(max_length=200, null=False, unique=True)
    link = models.URLField(blank=True, null=True, unique=True)

    def __str__(self):
        return self.title


class Member(models.Model):
    first_name = models.CharField(max_length=100, null=False)
    last_name = models.CharField(max_length=100, null=False)
    phone = models.CharField(max_length=20, blank=True, null=True)
    wechat_id = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(max_length=100, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(null=True, blank=True)
    pfp_url = models.CharField(max_length=200, blank=True, null=True, unique=False)
    department = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class department(models.Model):
    code = models.CharField(max_length=10, null=False)
    manager = models.ForeignKey(Member, on_delete=models.SET_NULL, null=True, related_name='managed_departments')  
    members = models.ManyToManyField(Member, related_name='departments')

class Resource(models.Model):
    title = models.CharField(max_length=200, null=False, unique=True)
    description = models.TextField(null=True, blank=True)
    resource_url = models.URLField(blank=True, null=True, unique=True)

    def __str__(self):
        return self.title