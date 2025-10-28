from django.db import models
from django.contrib.auth.models import User

class Cameras(models.Model):
    titulo = models.CharField(max_length=50)
    user = models.CharField(max_length=20)
    senha = models.CharField(max_length=50)
    porta_rtsp = models.CharField(max_length=20, default='554')
    dominio = models.CharField(max_length=20)
    ns = models.CharField(max_length=50)
    mac = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    cliente = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cams")
    
    def __str__(self):
        return self.titulo
    
class LinkRTSP(models.Model):
    camera = models.ForeignKey(Cameras, on_delete=models.CASCADE, related_name="link_rtsp")
    rtsp = models.CharField(max_length=255)
    
    def __str__(self):
        return self.rtsp
    
class Endereco(models.Model):
    camera = models.ForeignKey(Cameras, on_delete=models.CASCADE, related_name="endereco")
    cep = models.CharField(max_length=20)
    rua = models.CharField(max_length=100)
    bairro = models.CharField(max_length=100)
    cidade = models.CharField(max_length=100)
    estado = models.CharField(max_length=2)
    num = models.CharField(max_length=10, blank=True, null=True)
    lat = models.FloatField(blank=True, null=True)
    lon = models.FloatField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.rua}, {self.bairro}-{self.estado}"
    
class Torres(models.Model):
    nome = models.CharField(max_length=255, default="n/a")
    cameras = models.ForeignKey(Cameras, on_delete=models.CASCADE, related_name="torre")
    usuarios = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_torres")
    usuarios_autorizados = models.ManyToManyField(User, related_name="torres_acesso", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.nome