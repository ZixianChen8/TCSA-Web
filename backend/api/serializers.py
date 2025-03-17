# serializers.py
from rest_framework import serializers
from .models import Event, Participant, Member

# Serializer for Event Model (used for fetching event details)
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'  # Includes all fields in the Event model

# Serializer for Participant Model (used for registering users)
class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = ['id', 'first_name', 'last_name', 'email']
        
    def validate_first_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("First name cannot be empty.")
        return value
    
    def validate_last_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Last name cannot be empty.")
        return value
    
    def validate_email(self, value):
        if value and not value.strip():
            raise serializers.ValidationError("Email cannot be empty if provided.")
        return value

# Serializer for Member Model (used for team display)
class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'first_name', 'last_name', 'email', 'position', 
                  'description', 'pfp_url', 'department']