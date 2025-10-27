from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, CamerasSerializer, EnderecoSerializer, LinkRTSPSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Cameras, LinkRTSP, Endereco

class CamerasListCreate(generics.ListCreateAPIView):
    serializer_class = CamerasSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Cameras.objects.filter(cliente=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)
            
class CamerasDelete(generics.DestroyAPIView):
    serializer_class = CamerasSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Cameras.objects.filter(cliente=user)
    
class EnderecoListCreate(generics.ListCreateAPIView):
    serializer_class = EnderecoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Endereco.objects.filter(camera=user)
    
class EnderecoDelete(generics.DestroyAPIView):
    serializer_class = EnderecoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Endereco.objects.filter(camera=user)
    
class LinkRTSPListCreate(generics.ListCreateAPIView):
    serializer_class = LinkRTSPSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return LinkRTSP.objects.filter(camera=user)
    
class LinkRTSPDelete(generics.DestroyAPIView):
    serializer_class = LinkRTSPSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return LinkRTSP.objects.filter(camera=user)
    
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]