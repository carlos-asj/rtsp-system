from django.shortcuts import render
from django.db.models import Q
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import UserSerializer, CamerasSerializer, EnderecoSerializer, LinkRTSPSerializer, TorresSerializer
from .models import Cameras, LinkRTSP, Endereco, Torres

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
    
class UserViewSet(viewsets.ViewSet):
    """
    ViewSet para usuários - usando ViewSet básico para evitar problemas
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        """
        Lista todos os usuários
        URL: GET /api/users/
        """
        try:
            users = User.objects.all().values('id', 'username', 'email', 'is_active')
            return Response({
                'count': users.count(),
                'users': list(users)
            })
        except Exception as e:
            return Response(
                {'error': f'Erro ao listar usuários: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def retrieve(self, request, pk=None):
        """
        Detalhes de um usuário específico
        URL: GET /api/users/1/
        """
        try:
            user = User.objects.get(pk=pk)
            return Response({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_active': user.is_active,
                'date_joined': user.date_joined,
                'last_login': user.last_login
            })
        except User.DoesNotExist:
            return Response(
                {'error': 'Usuário não encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Informações do usuário atual
        URL: GET /api/users/me/
        """
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_active': user.is_active,
            'date_joined': user.date_joined,
            'last_login': user.last_login,
            'is_superuser': user.is_superuser,
            'is_staff': user.is_staff
        })

class TorresViewSet(viewsets.ModelViewSet):
    serializer_class = TorresSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Torres.objects.all()
    
    def get_queryset(self):
        user = self.request.user
        return Torres.objects.filter(usuarios_autorizados=user).distinct()
    
    def perform_create(self, serializer):
        serializer.save(criador=self.request.user)
    
    @action(detail=True, methods=['post'])
    def adicionar_usuario(self, request, pk=None):
        torre = self.get_object()
        
        if not torre.usuarios_autorizados.filter(id=request.user.id).exists():
            return Response(
                {'erro': 'Você não tem permissão para modificar esta torre'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        usuario_id = request.data.get('usuario_id')
        if not usuario_id:
            return Response(
                {'erro': 'O campo usuario_id é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            usuario = User.objects.get(id=usuario_id)
            torre.usuarios_autorizados.add(usuario)
            
            return Response({
                'mensagem': f'Usuário {usuario.username} adicionado com sucesso à torre {torre.nome}',
                'total_usuarios': torre.usuarios_autorizados.count()
            })
            
        except User.DoesNotExist:
            return Response(
                {'erro': 'Usuário não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def remover_usuario(self, request, pk=None):
        torre = self.get_object()
        
        if not torre.usuarios_autorizados.filter(id=request.user.id).exists():
            return Response(
                {'erro': 'Você não tem permissão para modificar esta torre'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        usuario_id = request.data.get('usuario_id')
        if not usuario_id:
            return Response(
                {'erro': 'O campo usuario_id é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            usuario = User.objects.get(id=usuario_id)
            torre.usuarios_autorizados.remove(usuario)
            
            return Response({
                'mensagem': f'Usuário {usuario.username} removido com sucesso da torre {torre.nome}',
                'total_usuarios': torre.usuarios_autorizados.count()
            })
            
        except User.DoesNotExist:
            return Response(
                {'erro': 'Usuário não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def minhas_torres(self, request):
        torres = self.get_queryset()
        serializer = self.get_serializer(torres, many=True)
        return Response(serializer.data)