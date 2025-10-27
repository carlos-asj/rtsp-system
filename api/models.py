from django.db import models
from django.contrib.auth.models import User

class LinkRTSP(models.Model):
    link = models.CharField(max_length=50)
    
    def __str__(self):
        return self.rtsp

class Cameras(models.Model):
    titulo = models.CharField(max_length=50)
    user = models.CharField(max_length=20)
    senha = models.CharField(max_length=50)
    dominio = models.CharField(max_length=20)
    ns = models.CharField(max_length=50)
    mac = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    cliente = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cams")
    link_rtsp = models.ForeignKey(LinkRTSP, on_delete=models.CASCADE, related_name="rtsp")
    
    def __str__(self):
        return self.titulo
    
class Endereco(models.Model):
    camera = models.ForeignKey(Cameras, on_delete=models.CASCADE, related_name="endereco")
    cep = models.CharField(max_length=20)
    rua = models.CharField(max_length=100)
    bairro = models.CharField(max_length=100)
    cidade = models.CharField(max_length=100)
    estado = models.CharField(max_length=2)
    
    def __str__(self):
        return self.bairro