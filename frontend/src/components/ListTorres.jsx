/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/FormTorre.css";

function ListTorres({ torre, onDelete }) {
    const [torres, setTorres] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getTorres();
    }, []);

    const getTorres = async () => {
        try{
            const response = await api.get("/api/torres/");
            setTorres(response.data);
        } catch (error) {
            if(error.response?.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                window.location.href = '/login';
            } else {
                alert(`Erro: ${error.message}`);
            };
        };
    };

    const handleEdit = () => {
        navigate('/edit-torre')
    };

    if (!torre){
        return <div>Erro: Dados da torre não disponíveis</div>
    }

    const formattedDate = torre.created_at ? new Date(torre.created_at).toLocaleDateString("pt-BR") : "Data não disponível";
    const cams_details = torre.cams_details || [];

    return (
        <div className="main-container">
            <div className="cam-full">
                <div className="camera-list">
                    <p className="cam-tit title2">{torre.titulo}</p>
                    {cams_details.length > 0 ? (
                        cams_details.map((cam, index) => (
                            <div key={cam.id || index}>
                                <p><strong>Câmera: </strong>
                                {cam.titulo || "Não informado"}</p>
                            </div>
                        ))
                    ):(
                        <p>Câmeras não disponíveis para essa torre.</p>
                    )}

                    <p><strong>Data de criação:</strong> {formattedDate}</p>
                    <div>
                        <button className="btn-del" onClick={handleEdit}>
                            Editar
                        </button>
                        <button className="btn-del" onClick={() => onDelete(torre.id)}>
                            Deletar
                        </button>
                    </div>
                        
                </div>
            </div>
        </div>
    );
}

export default ListTorres;