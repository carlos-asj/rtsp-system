import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListCamera from "../components/ListCamera";
import CadCamera from "../components/CadCamera";
import DashCams from "../components/DashCams";
import api from "../api";
import "../styles/Home.css";

function Home() {

    const [cameras, setCameras] = useState([]);
    const [refreshList, setRefreshList] = useState(false);
    
    const handleCameraAdicionada = () => {
        setRefreshList(prev => !prev);
    }

    useEffect(() => {
        getCameras();
    }, [refreshList]);

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

    const deleteCamera = (id) => {
        api.delete(`api/cameras/${id}/`).then((res) => {
            if (res.status === 204){
                setRefreshList(prev => !prev)
            } else alert("Falha ao deletar câmera.");
            getCameras();
        }).catch((err) => alert(err));
    }

    return (
        <div>
            <div className="main-container">
                <h3>CÂMERAS</h3>
                {cameras.map((camera) => (
                    <DashCams camera={camera} onDelete={deleteCamera} key={camera.id} atualizar={refreshList} />
                ))}
            </div>
            <div className="form-container">
                <h3>Adicionar câmera</h3>
                <div>
                    <CadCamera route="api/cameras/" method="cadastro" onCameraCadastrada={handleCameraAdicionada} />
                </div>
            </div>
        </div>

    )
}

export default Home;