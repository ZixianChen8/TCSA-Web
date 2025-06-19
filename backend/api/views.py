from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, status

from .models import Event, Registration, Member, CircularGalleryImage, Sponsor, ServicesBgImage, ClubAlumnus, TelferAlumnus, BenefitBgImage, ResourceCarouselImage, Resource, HomeHeroMedia, EventHeroImage, AlumniHeroImage, ServicesHeroImage, JoinUsHeroImage, ResourceHeroImage, OpenPosition
from .serializers import EventSerializer, RegistrationSerializer, MemberSerializer, CircularGalleryImageSerializer, SponsorSerializer, ServicesBgImageSerializer, ClubAlumnusSerializer, TelferAlumnusSerializer, BenefitBgImageSerializer, ResourceCarouselImageSerializer, ResourceSerializer, HomeHeroMediaSerializer, EventHeroImageSerializer, AlumniHeroImageSerializer, ServicesHeroImageSerializer, JoinUsHeroImageSerializer, ResourceHeroImageSerializer, OpenPositionSerializer

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
                print(f"- Duration: {event.duration}")
            
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
            print(f"- Duration: {instance.duration}")
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error fetching event: {str(e)}")
            return Response(
                {"error": "Failed to load event details. Please try again later."},
                status=status.HTTP_404_NOT_FOUND
            )


class MemberListView(generics.ListAPIView):
    queryset = Member.objects.select_related('department', 'reports_to').all()
    # Using select_related('department', 'reports_to') can help optimize database queries
    # by fetching related objects in a single query.
    serializer_class = MemberSerializer


# Gallery images API view
class CircularGalleryImageListAPIView(generics.ListAPIView):
    queryset = CircularGalleryImage.objects.all()
    serializer_class = CircularGalleryImageSerializer

    def list(self, request, *args, **kwargs):
        try: 
            queryset = self.get_queryset()
            print(f"\nFetched {queryset.count()} CircularGalleryImage items.")
            for img in queryset:
                print(f"- {img.title} ({img.image.url if img.image else 'No image'})")

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in CircularGalleryImageListAPIView: {str(e)}")
            return Response(
                {"error": "Failed to load circular gallery images."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Sponsor List API view
class SponsorLogoListAPIView(generics.ListAPIView):
    # queryset = Sponsor.objects.all()
    serializer_class = SponsorSerializer

    def get_queryset(self):
        return Sponsor.objects.exclude(logo_img__isnull=True).exclude(logo_img='')

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            print(f"\nFetched {queryset.count()} Sponsor items.")
            for sponsor in queryset:
                print(f"- {sponsor.name} ({sponsor.logo_img.url if sponsor.logo_img else 'No logo'})")

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in SponsorListAPIView: {str(e)}")
            return Response(
                {"error": "Failed to load sponsor data."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Services background images API view
class ServicesBgImageListAPIView(generics.ListAPIView):
    serializer_class = ServicesBgImageSerializer

    def get_queryset(self):
        return ServicesBgImage.objects.all()

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            print(f"\nFetched {queryset.count()} ServicesBgImage items.")
            for img in queryset:
                print(f"- {img.title} ({img.image.url})")

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in ServicesBgImageListAPIView: {str(e)}")
            return Response(
                {"error": "Failed to load services background images."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )





# Club alumnus API view
class ClubAlumnusListAPIView(generics.ListAPIView):
    queryset = ClubAlumnus.objects.all()
    serializer_class = ClubAlumnusSerializer

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            print(f"\nFetched {queryset.count()} ClubAlumnus items.")
            for alum in queryset:
                print(f"- {alum.name} ({alum.position or 'No position'})")

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in ClubAlumnusListAPIView: {str(e)}")
            return Response(
                {"error": "Failed to load club alumnus data."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Telfer alumnus API view
class TelferAlumnusListAPIView(generics.ListAPIView):
    queryset = TelferAlumnus.objects.all()
    serializer_class = TelferAlumnusSerializer

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            print(f"\nFetched {queryset.count()} TelferAlumnus items.")
            for alum in queryset:
                print(f"- {alum.name} ({alum.email or 'No email'})")

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in TelferAlumnusListAPIView: {str(e)}")
            return Response(
                {"error": "Failed to load Telfer alumnus data."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Benefit background images API view
class BenefitBgImageListAPIView(generics.ListAPIView):
    serializer_class = BenefitBgImageSerializer

    def get_queryset(self):
        return BenefitBgImage.objects.all()

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            print(f"\nFetched {queryset.count()} BenefitBgImage items.")
            for img in queryset:
                print(f"- {img.title} ({img.image.url})")

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in BenefitBgImageListAPIView: {str(e)}")
            return Response(
                {"error": "Failed to load benefit background images."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Resource carousel images API view
class ResourceCarouselImageListAPIView(generics.ListAPIView):
    queryset = ResourceCarouselImage.objects.all()
    serializer_class = ResourceCarouselImageSerializer

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            print(f"\nFetched {queryset.count()} ResourceCarouselImage items.")
            for img in queryset:
                print(f"- {img.title} ({img.image.url if img.image else 'No image'})")

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in ResourceCarouselImageListAPIView: {str(e)}")
            return Response(
                {"error": "Failed to load resource carousel images."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Resource list API view
class ResourceListAPIView(generics.ListAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            print(f"\nFetched {queryset.count()} Resource items.")
            for res in queryset:
                print(f"- {res.title} (URL: {res.resource_url or 'No URL'})")

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in ResourceListAPIView: {str(e)}")
            return Response(
                {"error": "Failed to load resources."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Home hero media API view
class HomeHeroMediaListAPIView(generics.ListAPIView):
    queryset = HomeHeroMedia.objects.all()
    serializer_class = HomeHeroMediaSerializer

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            print(f"\nFetched {queryset.count()} HomeHeroMedia items.")
            for media in queryset:
                media_type = 'video' if media.video else 'image'
                print(f"- {media.title} ({media_type}: {getattr(media, media_type).url})")

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in HomeHeroMediaListAPIView: {str(e)}")
            return Response(
                {"error": "Failed to load home hero media."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Event hero image API view
class EventHeroImageListAPIView(generics.ListAPIView):
    queryset = EventHeroImage.objects.all()
    serializer_class = EventHeroImageSerializer

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            print(f"\nFetched {queryset.count()} EventHeroImage items.")
            for img in queryset:
                print(f"- {img.title} ({img.image.url if img.image else 'No image'})")
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in EventHeroImageListAPIView: {str(e)}")
            return Response(
                {"error": "Failed to load event hero images."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Alumni hero image API view
class AlumniHeroImageListAPIView(generics.ListAPIView):
    queryset = AlumniHeroImage.objects.all()
    serializer_class = AlumniHeroImageSerializer

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            print(f"\nFetched {queryset.count()} AlumniHeroImage items.")
            for img in queryset:
                print(f"- {img.title} ({img.image.url if img.image else 'No image'})")
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in AlumniHeroImageListAPIView: {str(e)}")
            return Response(
                {"error": "Failed to load alumni hero images."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Services page hero image API view
class ServicesHeroImageListAPIView(generics.ListAPIView):
    queryset = ServicesHeroImage.objects.all()
    serializer_class = ServicesHeroImageSerializer

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            print(f"\nFetched {queryset.count()} ServicesHeroImage items.")
            for img in queryset:
                print(f"- {img.title} ({img.image.url if img.image else 'No image'})")
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in ServicesHeroImageListAPIView: {str(e)}")
            return Response(
                {"error": "Failed to load services hero images."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Resource page hero image API view
# Resource page hero image API view
class ResourceHeroImageListAPIView(generics.ListAPIView):
    queryset = ResourceHeroImage.objects.all()
    serializer_class = ResourceHeroImageSerializer

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            print(f"\nFetched {queryset.count()} ResourceHeroImage items.")
            for img in queryset:
                print(f"- {img.title} ({img.image.url if img.image else 'No image'})")
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in ResourceHeroImageListAPIView: {str(e)}")
            return Response(
                {"error": "Failed to load resource hero images."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Open positions API view
class OpenPositionListAPIView(generics.ListAPIView):
    queryset = OpenPosition.objects.all().order_by('-posted_at')
    serializer_class = OpenPositionSerializer

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            print(f"\nFetched {queryset.count()} OpenPosition items.")
            for pos in queryset:
                print(f"- {pos.title} (posted at: {pos.posted_at})")
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in OpenPositionListAPIView: {str(e)}")
            return Response(
                {"error": "Failed to load open positions."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Join Us page hero image API view
class JoinUsHeroImageListAPIView(generics.ListAPIView):
    queryset = JoinUsHeroImage.objects.all()
    serializer_class = JoinUsHeroImageSerializer

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            print(f"\nFetched {queryset.count()} JoinUsHeroImage items.")
            if queryset.exists():
                img = queryset.first()
                print(f"- {img.title} ({img.image.url if img.image else 'No image'})")
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in JoinUsHeroImageListAPIView: {str(e)}")
            return Response(
                {"error": "Failed to load join us hero images."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['POST'])
def register_for_event(request, id):
    """Register a user for the given event by ID."""
    try:
        event = Event.objects.get(pk=id)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

    # Merge posted data with event reference
    data = request.data.copy()
    data['event'] = event.id

    serializer = RegistrationSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
