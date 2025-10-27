from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Cameras, Endereco, LinkRTSP

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
        
    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user
    
class LinkRTSPSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinkRTSP
        fields = ["id", "link"]

class EnderecoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Endereco
        fields = ["id", "cep", "rua", "bairro", "cidade", "estado", "camera"]
        extra_kwargs = {"camera": {"write_only": True}}
    
class CamerasSerializer(serializers.ModelSerializer):
    link_rtsp = LinkRTSPSerializer(many=True, read_only=True)
    endereco = EnderecoSerializer(many=True, read_only=True)
    
    link_rtsp_gerado = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Cameras
        fields = ["id", "titulo", "user", "senha", "dominio", "porta_rtsp", "link_rtsp", "ns", "mac", "endereco", "created_at", "link_rtsp_gerado", "cliente"]
        extra_kwargs = {"created_at": {"read_only": True}, "cliente": {"read_only": True}}
        
    def get_link_rtsp_gerado(self, obj):
            return f"rtsp://{obj.user}:{obj.senha}@{obj.dominio}:{obj.porta_rtsp}/cam/realmonitor?channel=1&subtype=0"
        
    def create(self, validated_data):
        camera = Cameras.objects.create(**validated_data)
        
        link_rtsp = f"rtsp://{camera.user}:{camera.senha}@{camera.dominio}:{camera.porta_rtsp}/cam/realmonitor?channel=1&subtype=0"
        LinkRTSP.objects.create(camera=camera, rtsp=link_rtsp)

        return camera
    
    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        
        link_rtsp = f"rtsp://{instance.user}:{instance.senha}@{instance.dominio}:{instance.porta_rtsp}/cam/realmonitor?channel=1&subtype=0"
        
        instance.link_rtsp.all().delete()
        LinkRTSP.objects.create(camera=instance, rtsp=link_rtsp)

        return instance