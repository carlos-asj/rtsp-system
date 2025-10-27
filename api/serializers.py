from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Cameras, Endereco, LinkRTSP

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
        
    def create(self, validate_data):
        print(validate_data)
        user = User.objects.create_user(**validate_data)
        return user
    
class CamerasSerializer(serializers.ModelField):
    class Meta:
        model = Cameras
        fields = ["id", "titulo", "user", "senha", "dominio", "link_rtsp", "ns", "mac", "endereco"]
        extra_kwargs = {"link_rtsp": {"write_only": True}, "endereco": {"write only": True}}

class EnderecoSerializer(serializers.ModelField):
    class Meta:
        model = Endereco
        fields = ["id", "cep", "rua", "bairro", "cidade", "estado", "camera"]
        extra_kwargs = {"camera": {"write_only": True}}
        
class LinkRTSPSerializer(serializers.ModelField):
    class Meta:
        model = LinkRTSP
        fields = ["id", "camera", "cep", "rua", "bairro", "cidade", "estado"]
        extra_kwargs = {"camera": {"write_only": True}}