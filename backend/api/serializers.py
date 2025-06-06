# serializers.py
from rest_framework import serializers
from .models import Event, Member, Department

# Serializer for Event Model (used for fetching event details)
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'  # Includes all fields in the Event model



# Serializer for members
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'code', 'name'] # Or any other fields you want to expose

class MemberSerializer(serializers.ModelSerializer):
    # To provide nested department information (like name, code)
    # The React code expects `member.department.name`
    department = DepartmentSerializer(read_only=True)

    # 'reports_to' is a ForeignKey to 'self' in your Member model.
    # By default, DRF will serialize this as the ID of the related member,
    # which matches what your React code expects for `reports_to_id: member.reports_to`.
    # If you need more details from the 'reports_to' member, you could use a nested serializer,
    # but for now, the ID is what your frontend code uses.

    class Meta:
        model = Member
        fields = [
            'id',
            'first_name',
            'last_name',
            'email',
            'phone',
            'position',
            'description',
            'pfp_url',
            'reports_to',  # This will serialize to the ID of the manager
            'quote',
            'department',  # This will use the nested DepartmentSerializer
        ]
        # To make sure 'reports_to' and 'department' are not required during deserialization
        # if you ever use this serializer for POST/PUT (though for this GET request, it's fine).
        # extra_kwargs = {
        #     'reports_to': {'allow_null': True, 'required': False},
        #     'department': {'allow_null': True, 'required': False}
        # }