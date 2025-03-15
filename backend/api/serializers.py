# serializers.py
from rest_framework import serializers
from .models import Event, Participant

# Serializer for Event Model (used for fetching event details)
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'  # Includes all fields in the Event model

# Serializer for Participant Model (used for registering users)
class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = ['id', 'first_name', 'last_name', 'phone', 'wechat_id']