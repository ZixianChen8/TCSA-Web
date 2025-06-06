from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, status

from .models import Event, Member
from .serializers import EventSerializer, MemberSerializer

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

# API view to get all team members
# class TeamMemberListAPIView(generics.ListAPIView):
#     queryset = Member.objects.all()
#     serializer_class = MemberSerializer

#     def list(self, request, *args, **kwargs):
#         try:
#             queryset = self.get_queryset()
#             print(f"\nFetching team members from database...")
#             print(f"Found {queryset.count()} team members")
            
#             serializer = self.get_serializer(queryset, many=True)
#             return Response(serializer.data)
#         except Exception as e:
#             print(f"Error in TeamMemberListAPIView: {str(e)}")
#             return Response(
#                 {"error": "Failed to fetch team members"},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )

class MemberListView(generics.ListAPIView):
    queryset = Member.objects.select_related('department', 'reports_to').all()
    # Using select_related('department', 'reports_to') can help optimize database queries
    # by fetching related objects in a single query.
    serializer_class = MemberSerializer