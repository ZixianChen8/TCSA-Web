from django.urls import path
from .views import get_data

# urlpatterns = [
#     path('home/', home, name='home')
# ]

urlpatterns = [
    path('data/', get_data, name='get_data'),
]