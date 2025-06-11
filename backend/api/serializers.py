from rest_framework import serializers
from .models import (
    Event,
    Registration,
    Department,
    Member,
    Resource,
    Sponsor,
    JoinUsHeroImage,
    JoinUsBgImage,
    CircularGalleryImage,
    ResourceCarouselImage,
    ResourceHeroImage,
    HomeHeroMedia,
    EventHeroImage,
    ServicesHeroImage,
    ServicesBgImage,
    AlumniHeroImage,
    ClubAlumnus,
    TelferAlumnus,
    NavbarLogo,
    BenefitBgImage,
)

# Note: ImageField and FileField are automatically handled by ModelSerializer.
# It will generate the correct URL for the uploaded file in the API response.

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'


class RegistrationSerializer(serializers.ModelSerializer):
    # Represents the 'event' ForeignKey by its string representation (__str__ method)
    event = serializers.StringRelatedField()

    class Meta:
        model = Registration
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    # Represents the 'manager' ForeignKey by its string representation
    manager = serializers.StringRelatedField()
    
    class Meta:
        model = Department
        fields = '__all__'


class MemberSerializer(serializers.ModelSerializer):
    # --- FIX for the 500 Error ---
    # By default, DRF doesn't know how to represent related objects (ForeignKeys).
    # StringRelatedField tells DRF to use the __str__ method of the related model.
    
    # Represents the 'department' ForeignKey by its name (e.g., "Technology")
    department = DepartmentSerializer(read_only=True)
    
    # Represents the self-referencing 'reports_to' ForeignKey by the manager's name
    reports_to = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Member
        # Explicitly list all fields to ensure they are included in the API response
        fields = [
            'id', 
            'first_name', 
            'last_name', 
            'phone', 
            'email', 
            'position', 
            'description', 
            'pfp_img', 
            'reports_to', 
            'quote', 
            'department'
        ]


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = '__all__'



class SponsorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sponsor
        fields = '__all__'


class JoinUsHeroImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = JoinUsHeroImage
        fields = '__all__'


class JoinUsBgImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = JoinUsBgImage
        fields = '__all__'


class CircularGalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CircularGalleryImage
        fields = '__all__'



class ResourceCarouselImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceCarouselImage
        fields = '__all__'


class ResourceHeroImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceHeroImage
        fields = '__all__'


class HomeHeroMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeHeroMedia
        fields = '__all__'


class EventHeroImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventHeroImage
        fields = '__all__'


class ServicesHeroImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicesHeroImage
        fields = '__all__'


class ServicesBgImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicesBgImage
        fields = '__all__'


class BenefitBgImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BenefitBgImage
        fields = '__all__'


class AlumniHeroImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlumniHeroImage
        fields = '__all__'


class ClubAlumnusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClubAlumnus
        fields = '__all__'


class TelferAlumnusSerializer(serializers.ModelSerializer):
    class Meta:
        model = TelferAlumnus
        fields = '__all__'


class NavbarLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = NavbarLogo
        fields = '__all__'
