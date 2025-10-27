from django.urls import path
from . import views

urlpatterns = [
    path("cameras/", views.CamerasListCreate.as_view(), name="camera-list"),
    path("camerasdelete/<int:pk>/", views.CamerasDelete.as_view(), name="delete-camera")
]