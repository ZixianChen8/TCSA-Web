from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, status

from .models import Event, Participant
from .serializers import EventSerializer, ParticipantSerializer

@api_view(['GET'])
def get_data(request):
    data = {
        "message": "Hello from Django API"
    }
    return Response(data)

class EventListAPIView(generics.ListAPIView):
    queryset = Event.objects.all().order_by('start_date')
    serializer_class = EventSerializer

    def list(self, request, *args, **kwargs):
        try:
            # Get all events and order them
            queryset = self.get_queryset()
            print(f"\nFetching events from database...")
            print(f"Found {queryset.count()} events")
            print("\nEvents in order:")
            for event in queryset:
                print(f"\nEvent details:")
                print(f"- ID: {event.id}")
                print(f"- Title: {event.title}")
                print(f"- Start Date: {event.start_date}")
                print(f"- Location: {event.location}")
                print(f"- Organizer: {event.organizer}")
                print(f"- Description: {event.description[:50]}...")
            
            # Serialize the data
            serializer = self.get_serializer(queryset, many=True)
            response_data = serializer.data
            
            # Log the response data
            print(f"\nSending response with {len(response_data)} events")
            for event_data in response_data:
                print(f"- {event_data['title']} (ID: {event_data['id']})")
            
            return Response(response_data)
        except Exception as e:
            print(f"Error in EventListAPIView: {str(e)}")
            return Response(
                {"error": "Failed to fetch events"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class EventDetailAPIView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    lookup_url_kwarg = 'id'
    lookup_field = 'pk'

    def get(self, request, *args, **kwargs):
        try:
            print(f"Attempting to fetch event with id: {kwargs.get('id')}")
            instance = self.get_object()
            print(f"Found event: {instance}")
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error fetching event: {str(e)}")
            return Response(
                {"error": "Failed to load event details. Please try again later."},
                status=status.HTTP_404_NOT_FOUND
            )

# Handle event registration by creating a Participant and adding it to the Event's participants list
class EventRegistrationAPIView(generics.GenericAPIView):
    serializer_class = ParticipantSerializer

    def post(self, request, *args, **kwargs):
        event_id = kwargs.get('id')
        print(f"\n=== EVENT REGISTRATION REQUEST ===")
        print(f"Event ID: {event_id}")
        print(f"Request data: {request.data}")
        
        try:
            event = Event.objects.get(id=event_id)
            print(f"Found event: {event.title}")
        except Event.DoesNotExist:
            print(f"Event with ID {event_id} not found")
            return Response({"error": "Event not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            print(f"Data is valid: {serializer.validated_data}")
            participant = serializer.save()
            print(f"Created participant: {participant.first_name} {participant.last_name} (ID: {participant.id})")
            event.participants.add(participant)
            print(f"Added participant to event. Current participant count: {event.participants.count()}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

