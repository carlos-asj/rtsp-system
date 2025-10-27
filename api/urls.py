from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CamerasViewSet, LinkRTSPViewSet, EnderecoViewSet

router = DefaultRouter()
router.register(r'cameras', CamerasViewSet, basename='cameras')
router.register(r'link-rtsp', LinkRTSPViewSet, basename='link-rtsp')
router.register(r'endereco', EnderecoViewSet, basename='enderecos')

urlpatterns = [
    path('', include(router.urls)),
    
]