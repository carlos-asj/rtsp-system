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
    torre_atual = models.ForeignKey('Torres', on_delete=models.SET_NULL, related_name="cameras_torre", blank=True, null=True, verbose_name="Torre atual")
    
    def __str__(self):
        return self.titulo
    
    def clean(self):
        if self.torre_atual and self.torre_atual not in self.cliente.torres_acesso.all():
            raise ValidationError("Você não tem permissão para associar esta câmera a esta torre")
    
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
    titulo = models.CharField(max_length=255, default="n/a")
    cams_torres = models.ManyToManyField(Cameras, related_name="cams_torres", blank=True)
    usuarios_autorizados = models.ManyToManyField(User, related_name="torres_acesso", blank=True)
    criador = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.titulo