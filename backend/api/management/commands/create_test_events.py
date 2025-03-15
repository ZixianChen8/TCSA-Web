from django.core.management.base import BaseCommand
from api.models import Event
from datetime import date, timedelta

class Command(BaseCommand):
    help = 'Creates test events if they do not exist'

    def handle(self, *args, **kwargs):
        # Create test events
        events = [
            {
                'title': 'Spring Career Fair 2024',
                'description': 'Join us for our annual Spring Career Fair! Meet with top employers and explore internship and job opportunities.',
                'date': date.today() + timedelta(days=7),
                'location': 'Student Union Building, Room 205',
                'organizer': 'TCSA Career Development Team',
            },
            {
                'title': 'Cultural Night: Lunar New Year Celebration',
                'description': 'Celebrate Lunar New Year with traditional performances, food, and activities!',
                'date': date.today() + timedelta(days=14),
                'location': 'University Center, Grand Hall',
                'organizer': 'TCSA Cultural Events Committee',
            },
            {
                'title': 'Academic Success Workshop',
                'description': 'Learn essential study skills and time management techniques from successful senior students.',
                'date': date.today() + timedelta(days=21),
                'location': 'Library Learning Commons',
                'organizer': 'TCSA Academic Support Team',
            },
        ]

        # Print existing events
        existing_events = Event.objects.all()
        self.stdout.write("\nExisting events in database:")
        for event in existing_events:
            self.stdout.write(f"- {event.title} (ID: {event.id})")

        # Add new events only if they don't exist
        for event_data in events:
            event, created = Event.objects.get_or_create(
                title=event_data['title'],
                defaults=event_data
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created new event: {event.title}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Event already exists: {event.title}')
                ) 