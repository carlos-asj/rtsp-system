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
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        instance = super().update(instance, validated_data)
        
        if password:
            instance.set_password(password)
            instance.save()
        
        return instance

class UserListSerializer(serializers.ModelSerializer):
    total_torres = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 
            'username', 
            'email', 
            'total_torres'
        ]
    
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
    
    def get_torre_atual_info(self, obj):
        if obj.torre_atual:
            return {
                'id': obj.torre_atual.id,
                'titulo': obj.torre_atual.titulo
            }
        return None
        
    def create(self, validated_data):
        camera = Cameras.objects.create(**validated_data)
        
        link_rtsp = f"rtsp://{camera.user}:{camera.senha}@{camera.dominio}:{camera.porta_rtsp}/cam/realmonitor?channel=1&subtype=0"
        LinkRTSP.objects.create(camera=camera, rtsp=link_rtsp)

        return camera
    
    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        torre_nova = validated_data.get('torre_atual')
        torre_antiga = instance.torre_atual
        
        if torre_nova != torre_antiga:
            print(f"Movendo câmera {instance.titulo} da torre {torre_antiga} para {torre_nova}")
        
        link_rtsp = f"rtsp://{instance.user}:{instance.senha}@{instance.dominio}:{instance.porta_rtsp}/cam/realmonitor?channel=1&subtype=0"
        
        instance.link_rtsp.all().delete()
        
        LinkRTSP.objects.create(camera=instance, rtsp=link_rtsp)

        return instance
    
class TorresSerializer(serializers.ModelSerializer):
    criador = serializers.CharField(source='user_torres.username', read_only=True)
    cams_torres = serializers.PrimaryKeyRelatedField(many=True, queryset=Cameras.objects.all(), required=False) # 'cameras_torre' related_name do campo torre_atual
    cams_details = CamerasSerializer(source='cams_torres', many=True, read_only=True)
    
    total_users = serializers.SerializerMethodField()
    
    add_cams_torre = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Torres
        fields = ["id", "titulo", "cams_torres", "cams_details", "add_cams_torre", "usuarios_autorizados", "total_users", "criador", "created_at"]
        extra_kwargs = {'criador': {'read_only': True},
                        'usuarios_autorizados': {'write_only': True}}
        
    def get_total_users(self, obj):
        return obj.usuarios_autorizados.count()
    
    def create(self, validated_data):
        usuarios_data = validated_data.pop('usuarios_autorizados', [])
        cameras_data = validated_data.pop('cams_torres', [])
        
        torre = Torres.objects.create(**validated_data)
        
        # Adiciona os usuários autorizados
        if usuarios_data:
            torre.usuarios_autorizados.set(usuarios_data)
            
        if cameras_data:
            torre.cams_torres.set(cameras_data)
        
        torre.usuarios_autorizados.add(self.context['request'].user)
        
        return torre
    
    def update(self, instance, validated_data):
        usuarios_data = validated_data.pop('usuarios_autorizados', None)
        cameras_data = validated_data.pop('cams_torres', None)
        
        # Atualiza os outros campos
        instance = super().update(instance, validated_data)
        
        
        # Atualiza os usuários autorizados se fornecidos
        if usuarios_data is not None:
            instance.usuarios_autorizados.set(usuarios_data)
        
        if cameras_data is not None:
            instance.cams_torres.set(cameras_data)
        
        return instance