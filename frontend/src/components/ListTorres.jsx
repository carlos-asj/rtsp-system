import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

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

    if (!torre){
        return <div>Erro: Dados da torre não disponíveis</div>
    }

    const formattedDate = torre.created_at ? new Date(torre.created_at).toLocaleDateString("pt-BR") : "Data não disponível";
    const cams_details = torre.cams_details || [];

    return (
        <div className="cam-full">
            <div className="camera-list">
                {torres.map(torre => {
                    const cams = torre.cams_details || [];
                    return (
                        <div key={torre.id} className="">
                            <p><strong>Título: </strong>{torre.titulo}</p>
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
                <p><strong>Data de criação:</strong> {formattedDate}</p>
                <div className="camera-actions">
                    <button className="btn-del"onClick={() => onDelete(torre.id)}>
                        Deletar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ListTorres;