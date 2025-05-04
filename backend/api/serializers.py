# serializers.py
from rest_framework import serializers
from .models import Event, Member

# Serializer for Event Model (used for fetching event details)
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'  # Includes all fields in the Event model

# Serializer for Member Model (used for team display)
class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'first_name', 'last_name', 'email', 'position', 
                  'description', 'pfp_url', 'department']