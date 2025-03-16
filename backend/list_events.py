import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Event

def list_events():
    print("\nAvailable events:")
    for event in Event.objects.all():
        print(f"ID: {event.id}, Title: {event.title}")

if __name__ == "__main__":
    list_events() 