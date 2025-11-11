/* eslint-disable no-unused-vars */
import {useState, useEffect} from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function DashTorres({ torre }) {
    const [torres, setTorres] = useState([]);
    const [cameras, setCameras] = useState([]);
    const navigate = useNavigate();

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
    // console.log("Dados da torre:", torre);
    // console.log("Câmeras:", cams_torres);
    // console.log("Tipo das câmeras:", typeof cams_torres);

    return (
        <div className="main-container">
            <div className="camera-item">
                <div className="camera-info">
                    <h3 className="title2">{torre.titulo || "Sem título"}</h3>
                    <div className="cams-torres">
                        {torres.map(torre => {
                            const cams = torre.cams_details || [];
                            return (
                                <div key={torre.id}>
                                    {cams.length > 0 ? (
                                        cams.map((cam, index) => (
                                            <div key={cam.id || index}>
                                                <p><strong>Câmera {index + 1}: </strong>
                                                {cam.titulo || "Não informado"}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Câmeras não disponíveis para esta torre</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <p className="subtitle"><strong>Data de criação:</strong> {formattedDate}</p>
                </div>
            </div>
        </div>
    )
}

export default DashTorres;