from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import UserSerializer, CamerasSerializer, EnderecoSerializer, LinkRTSPSerializer
from .models import Cameras, LinkRTSP, Endereco

class CamerasViewSet(viewsets.ModelViewSet):
    serializer_class = CamerasSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Cameras.objects.all()

    def get_queryset(self):
        return Cameras.objects.filter(cliente=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(cliente=self.request.user)
            
    @action(detail=True, methods=['get'])
    def gerar_link_rtsp(self, request, pk=None):
        camera = self.get_object()
        link_rtsp = f"rtsp://{camera.user}:{camera.senha}@{camera.dominio}:{camera.porta_rtsp}/cam/realmonitor?channel=1&subtype=0"
        
        LinkRTSP.objects.create(camera=camera, rtsp=link_rtsp)

        return Response({
            'link_rtsp': link_rtsp,
            'mensagem': 'Link RTSP gerado com sucesso'
        })
    
class EnderecoViewSet(viewsets.ModelViewSet):
    serializer_class = EnderecoSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Endereco.objects.all()

    def get_queryset(self):
        return Endereco.objects.filter(camera__cliente=self.request.user)
    
class LinkRTSPViewSet(viewsets.ModelViewSet):
    serializer_class = LinkRTSPSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = LinkRTSP.objects.all()
    
    def get_queryset(self):
        return LinkRTSP.objects.filter(camera__cliente=self.request.user)
    
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]