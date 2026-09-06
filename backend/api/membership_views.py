from rest_framework import status
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from .models import MembershipType, MemberEvent
from .membership_serializers import (
    MemberEventPublicSerializer,
    MemberEventSignupSerializer,
    MembershipApplySerializer,
    MembershipLookupSerializer,
    MembershipTypePublicSerializer,
)
from .membership_services import (
    apply_and_notify,
    interac_payload,
    lookup_member_id,
    register_for_member_event,
)


class MembershipBurstThrottle(AnonRateThrottle):
    scope = "membership"


@api_view(["GET"])
def membership_config(request):
    types = MembershipType.objects.filter(is_open=True)
    return Response({
        "types": MembershipTypePublicSerializer(types, many=True).data,
        "interac": interac_payload(),
    })


@api_view(["POST"])
@throttle_classes([MembershipBurstThrottle])
def membership_apply(request):
    serializer = MembershipApplySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    try:
        member, application, payment = apply_and_notify(serializer.validated_data)
    except ValueError as exc:
        return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(
        {
            "member_id": member.member_id,
            "application_ref": application.application_ref,
            "status": member.status,
            "amount": str(payment.amount_expected),
            "membership_type": member.membership_type.name,
            "interac": interac_payload(),
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@throttle_classes([MembershipBurstThrottle])
def membership_lookup(request):
    serializer = MembershipLookupSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    lookup_member_id(serializer.validated_data["email"])
    return Response({
        "message": "If that email is on file, we sent a member ID reminder.",
    })


@api_view(["GET"])
def member_event_list(request):
    events = MemberEvent.objects.all()
    return Response(MemberEventPublicSerializer(events, many=True).data)


@api_view(["GET"])
def member_event_detail(request, id):
    try:
        event = MemberEvent.objects.get(pk=id)
    except MemberEvent.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
    return Response(MemberEventPublicSerializer(event).data)


@api_view(["POST"])
@throttle_classes([MembershipBurstThrottle])
def member_event_register(request, id):
    try:
        event = MemberEvent.objects.get(pk=id)
    except MemberEvent.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
    serializer = MemberEventSignupSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    try:
        signup = register_for_member_event(event, serializer.validated_data)
    except ValueError as exc:
        return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(
        {
            "id": signup.id,
            "status": signup.status,
            "event": event.title,
        },
        status=status.HTTP_201_CREATED,
    )
