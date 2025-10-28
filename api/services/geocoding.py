import requests
import time

class GeocodingService:
    @staticmethod
    def get_coordinates(endereco_completo):
        try:
            url = "https://nominatim.openstreetmap.org/search"
            params = {
                'q': endereco_completo,
                'format': 'json',
                'limit': 1,
                'countrycodes': 'br'
            }
            headers = {
                'User-agent':'rtsp-system/1.0 (darcilemons@gmail.com)'
            }
            
            response = requests.get(url, params=params, headers=headers)
            response.raise_for_status()
            
            data = response.json()
            
            if data:
                return {
                    'lat': float(data[0]['lat']),
                    'lon': float(data[0]['lon'])
                }
            else:
                return None
        except Exception as e:
            print(f"Erro no geocoding: {e}")
            return None
        
    @staticmethod
    def formatar_endereco(endereco_instance):
        partes = [endereco_instance.rua,
                  endereco_instance.num if endereco_instance.num else "",
                  endereco_instance.bairro,
                  endereco_instance.cidade,
                  endereco_instance.estado,
                  "Brasil"]

        return ", ".join([p for p in partes if p])