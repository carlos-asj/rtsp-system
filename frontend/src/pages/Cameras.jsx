import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ListCamera from "../components/ListCamera";
import api from "../api";
import "../styles/CadCam.css"

function Cameras() {

    const [cameras, setCameras] = useState([]);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
    }

    useEffect(() => {
        getCameras();
    }, []);

    const getCameras = async () => {
        try {            
            const response = await api.get("/api/cameras/");
            setCameras(response.data);
            
        } catch (error) {
            
            if (error.response?.status === 401) {
                
                // Limpa TODOS os tokens
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                
                // Força redirecionamento
                window.location.href = '/login'; // Isso SEMPRE funciona
            } else {
                alert(`Erro: ${error.message}`);
            }
        }
    };

    const handleCadCams = () => {
        navigate('/cadastro');
    };

    const deleteCamera = (id) => {
        api
            .delete(`/api/cameras/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Câmera deletada!");
                else alert("Falha ao deletar câmera.");
                getCameras();
            })
            .catch((error) => alert(error));
    };

    const handleLogout = () => {
        navigate('/logout');
    };

    return (
        <div>
        <button className="btn-back" onClick={handleBack}>Voltar</button>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
        <div className="body bg-white rounded-lg p-6">
            <p className="title2">CÂMERAS ({cameras.length})</p>
            <div className="container-listcam">
                {cameras.map((camera) => (
                    <ListCamera camera={camera} key={camera.id} onDelete={deleteCamera} />
                ))}
            </div>
            <button className="btn-cadcams" onClick={handleCadCams}>Adicionar</button>
        </div>
        </div>
    )
}

export default Cameras;