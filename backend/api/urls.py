# TCSA-WEB/backend/api/urls.py (Suggested Correction)

# Imports for settings, admin, static, and include are not used in these specific urlpatterns.
# You can remove them if they aren't needed for other parts of this file.
# from django.conf import settings
# from django.contrib import admin
# from django.urls import include # Not used
# from django.conf.urls.static import static

from django.urls import path
from .views import get_data, EventDetailAPIView, EventListAPIView, MemberListView # Assuming MemberListView class is here

urlpatterns = [
    path('data/', get_data, name='get_data'),
    path('events/', EventListAPIView.as_view(), name='event_list'),
    path('events/<int:id>/', EventDetailAPIView.as_view(), name='event_detail'),
    path('members/', MemberListView.as_view(), name='member_list'),
]