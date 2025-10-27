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
    camera = models.ForeignKey(Cameras, on_delete=models.CASCADE, related_name="camera")
    link = models.CharField(max_length=255)
    
    def __str__(self):
        return self.link
    
class Endereco(models.Model):
    camera = models.ForeignKey(Cameras, on_delete=models.CASCADE, related_name="endereco")
    cep = models.CharField(max_length=20)
    rua = models.CharField(max_length=100)
    bairro = models.CharField(max_length=100)
    cidade = models.CharField(max_length=100)
    estado = models.CharField(max_length=2)
    
    def __str__(self):
        return self.bairro