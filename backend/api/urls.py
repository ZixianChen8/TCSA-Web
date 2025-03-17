from django.urls import path
from .views import get_data, EventDetailAPIView, EventRegistrationAPIView, EventListAPIView, TeamMemberListAPIView


urlpatterns = [
    path('data/', get_data, name='get_data'),
    path('events/', EventListAPIView.as_view(), name='event_list'),
    path('events/<int:id>/', EventDetailAPIView.as_view(), name='event_detail'),
    path('events/<int:id>/register/', EventRegistrationAPIView.as_view(), name='event_register'),
    path('team/', TeamMemberListAPIView.as_view(), name='team_list'),
]

# 	•	path('api/events/<int:id>', ...):
# This is the URL pattern. It tells Django to match URLs that start with api/events/ and then have an integer. The <int:id> part is a path converter. It means that whatever number appears in that spot will be captured and passed to the view as a keyword argument named id.
# 	•	EventDetailAPIView.as_view():
# This calls the as_view() method on the class-based view EventDetailAPIView. It converts the class into a function that Django can use to handle requests. In other words, when the URL is matched, Django will call this view function.
# 	•	name='event-detail':
# This names the URL pattern. Naming a URL makes it easier to reference elsewhere in your project, for example when you want to reverse-resolve the URL (generate the URL string dynamically in templates or code).