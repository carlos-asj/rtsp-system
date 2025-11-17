/* eslint-disable no-unused-vars */
// COMPONENTE PARA MOSTRAR TODAS AS CÂMERAS COM DETALHES NO MENU DE CÂMERAS
import { useEffect, useState, React } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Home.css";

function ListCamera({ camera, onDelete }) {
    const [cameras, setCameras] = useState([]);
    const navigate = useNavigate();

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

    if (!camera) {
        return <div>Erro: Dados da câmera não disponíveis</div>;
    }

    const formattedDate = camera.created_at 
        ? new Date(camera.created_at).toLocaleDateString("pt-BR")
        : "Data não disponível";
    
    const linkRTSP = camera.link_rtsp || [];
    const hasLinks = Array.isArray(linkRTSP) && linkRTSP.length > 0;

    return (
        <div>
            <div>
                <div className="container-listcam">
                    <div className="cam-full">
                        <div className="camera-list">
                            <div className="cam-tit">
                                <a className="title3">{camera.titulo || "Sem título"}</a>
                            </div>
                            <div className="content">
                                <p><strong>Usuário:</strong> {camera.user || "Não informado"}</p>
                                <p><strong>Domínio:</strong> {camera.dominio || "Não informado"}</p>
                                <p><strong>Porta RTSP:</strong> {camera.porta_rtsp || "Não informada"}</p>
                                <p><strong>N/S:</strong> {camera.ns || "Não informado"}</p>
                                <p><strong>MAC:</strong> {camera.mac || "Não informado"}</p>
                                {linkRTSP.map(link => ( // BUSCA NA TABELA DE LINKS O LINK CORRESPONDENTE A CÂMERA ESPECÍFICA
                                    <p key={link.rtsp}>
                                        <strong>Link RTSP:</strong> {link.rtsp || "Link não disponível"}
                                    </p>
                                ))}
                                <p><strong>Data de criação:</strong> {formattedDate}</p>
                            </div>
                            <div className="cont-del">
                                <button className="btn-del"
                                    onClick={() => onDelete(camera.id)}
                                >
                                    Deletar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListCamera;