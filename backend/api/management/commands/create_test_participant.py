from django.core.management.base import BaseCommand
from api.models import Event, Participant

class Command(BaseCommand):
    help = 'Creates a test participant and registers for an event'

    def add_arguments(self, parser):
        parser.add_argument('event_id', type=int, help='ID of the event to register for')

    def handle(self, *args, **options):
        event_id = options['event_id']
        
        try:
            event = Event.objects.get(id=event_id)
            self.stdout.write(f"Found event: {event.title} (ID: {event.id})")
        except Event.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"Event with ID {event_id} does not exist"))
            return
            
        # Create a test participant
        participant = Participant.objects.create(
            first_name="Test",
            last_name="Participant",
            phone="123-456-7890",
            wechat_id="testuser123"
        )
        
        self.stdout.write(f"Created participant: {participant.first_name} {participant.last_name} (ID: {participant.id})")
        
        # Register the participant for the event
        event.participants.add(participant)
        self.stdout.write(self.style.SUCCESS(f"Registered participant for event: {event.title}"))
        
        # Verify the registration
        if participant in event.participants.all():
            self.stdout.write(self.style.SUCCESS("Participant successfully added to event!"))
            self.stdout.write(f"Event now has {event.participants.count()} participants")
        else:
            self.stdout.write(self.style.ERROR("Failed to add participant to event")) 