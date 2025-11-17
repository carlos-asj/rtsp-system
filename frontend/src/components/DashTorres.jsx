/* eslint-disable no-unused-vars */
import {useState, useEffect} from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function DashTorres({ torre }) {
    const [torres, setTorres] = useState([]);
    const [cameras, setCameras] = useState([]);

    useEffect(() => {
        getTorres();
        getCameras();
    }, []);

    const getTorres = async () => {
        try {            
            const response = await api.get("/api/torres/");
            setTorres(response.data);
            
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
    }

    if (!torre) {
        return <div> Erro: Dados da torre não disponíveis</div>;
    }

    const formattedDate = torre.created_at 
        ? new Date(torre.created_at).toLocaleDateString("pt-BR")
        : "Data não disponível";

    const cams_torres = torre.cams_torres || [];
    const cams_details = torre.cams_details || [];
    const hasCams = Array.isArray(torres) && torres.length > 0;

    return (
        <div className="main-container">
            <div className="camera-item">
                <div className="camera-info">
                    <h3 className="title2">{torre.titulo || "Sem título"}</h3>
                    <div className="subtitle">

                         {cams_details.length > 0 ? (
                            cams_details.map((cam, index) => (
                                <div key={cam.id || index}>
                                    {cam.titulo || "Não informado"}
                                </div>
                            ))
                         ):(
                            <p>Câmeras não disponíveis para esta torre.</p>
                         )}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashTorres;