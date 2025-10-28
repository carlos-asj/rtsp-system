from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Cameras, Endereco, LinkRTSP, Torres
from .services.geocoding import GeocodingService

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
        
    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user

class UserListSerializer(serializers.ModelSerializer):
    total_torres = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 
            'username', 
            'email', 
            'first_name', 
            'last_name',
            'is_active',
            'date_joined',
            'last_login',
            'total_torres'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']
    
    def get_total_torres(self, obj):
        """Retorna o total de torres que o usuário tem acesso"""
        return obj.torres_acessiveis.count()
    
class LinkRTSPSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinkRTSP
        fields = ["id", "rtsp"]

class EnderecoSerializer(serializers.ModelSerializer):
    coordenadas = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Endereco
        fields = ["id", "cep", "rua", "bairro", "cidade", "estado", "camera", "num", "lat", "lon", "coordenadas"]
        extra_kwargs = {"camera": {"write_only": True},
                        "lat": {"read_only": True},
                        "lon": {"read_only": True}}
        
    def get_coordenadas(self, obj):
        if obj.lat and obj.lon:
            return f"{obj.lat}, {obj.lon}"
        return None
    
    def create(self, validated_data):
        endereco = Endereco.objects.create(**validated_data)
        self._buscar_coordenadas(endereco)

        return endereco
    
    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)

        campos_endereco = ['rua', 'num', 'bairro', 'cidade', 'estado', 'cep']
        if any(field in validated_data for field in campos_endereco):
            self._buscar_coordenadas(instance)
            
        return instance
    
    def _buscar_coordenadas(self, endereco_instance):
        endereco_completo = GeocodingService.formatar_endereco(endereco_instance)
        coordenadas = GeocodingService.get_coordinates(endereco_completo)

        if coordenadas:
            endereco_instance.lat = coordenadas['lat']
            endereco_instance.lon = coordenadas['lon']
            endereco_instance.save()
    
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
    
class TorresSerializer(serializers.ModelSerializer):
    criador = serializers.CharField(source='user_torres.username', read_only=True)
    user_list = serializers.SerializerMethodField()
    total_users = serializers.SerializerMethodField()
    
    class Meta:
        model = Torres
        fields = ["titulo", "cameras", "usuarios", "usuarios_autorizados", "criador ", "created_at"]
        extra_kwargs = {"criador": {"read_only": True},
                        "usuarios_autorizados": {"write_only": True}}
        
    def get_usu_aut_list(self, obj):
        return obj.usuarios_autorizados.count()
    
    def create(self, validated_data):
        usuarios_data = validated_data.pop('usuarios_autorizados', [])
        
        torre = Torres.objects.create(**validated_data)
        
        # Adiciona os usuários autorizados
        if usuarios_data:
            torre.usuarios_autorizados.set(usuarios_data)
        
        # Sempre adiciona o usuário que criou como autorizado
        torre.usuarios_autorizados.add(self.context['request'].user)
        
        return torre
    
    def update(self, instance, validated_data):
        usuarios_data = validated_data.pop('usuarios_autorizados', None)
        
        # Atualiza os outros campos
        instance = super().update(instance, validated_data)
        
        # Atualiza os usuários autorizados se fornecidos
        if usuarios_data is not None:
            instance.usuarios_autorizados.set(usuarios_data)
        
        return instance