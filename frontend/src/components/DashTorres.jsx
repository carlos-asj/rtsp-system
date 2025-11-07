/* eslint-disable no-unused-vars */
import {useState, useEffect} from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function DashTorres({ torre }) {
    const [torres, setTorres] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getTorres();
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

    if (!torre) {
        return <div> Erro: Dados da torre não disponíveis</div>;
    }

    const formattedDate = torre.created_at 
        ? new Date(torre.created_at).toLocaleDateString("pt-BR")
        : "Data não disponível";

    const cams_torres = torre.cams_torres || [];
    const hasCams = Array.isArray(cams_torres) && cams_torres.length > 0;

    return (
        <div className="main-container">
            <div className="torre-item">
                <div className="torre-info">
                    <h3 className="title2">{torre.titulo || "Sem título"}</h3>
                    {cams_torres.map(cams => (
                        <p key={cams.cams_torres}>
                            <strong className="subtitle">Câmeras:</strong> {cams.cams_torres || "Câmeras não disponíveis"}
                        </p>
                    ))}
                    <p className="subtitle"><strong>Data de criação:</strong> {formattedDate}</p>
                </div>
            </div>
        </div>
    )
}

export default DashTorres;