import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

function EditTorre() {
    const { id } = useParams();
    const [cameras, setCameras] = useState([]);
    const [torre, setTorre] = useState([]);
    const [camerasDisponiveis, setCamerasDisponiveis] = useState([]);
    const [camerasNaTorre, setCamerasNaTorre] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const torreResponse = await api.get(`/api/get/torres/${id}/`);
                setTorre(torreResponse.data);

                const camsNaTorre = torreResponse.data.cams_details || [];
                setCamerasTorre(camsNaTorre);

                const camerasResponse = await api.get("/api/cameras/");
                const todasCameras = Array.isArray(camerasResponse.data) ? camerasResponse.data : [];

                const camerasDisponiveis = todasCameras.filter(camera =>
                    !camsNaTorre.some(camNaTorre => camNaTorre.id === camera.id)
                );

                setCamerasDisponiveis(camerasDisponiveis);

                console.log('Câmeras na torre:', camsNaTorre);
                console.log('Câmeras disponíveis:', camerasDisponiveis);
            } catch (error) {
                console.error('Erro detalhado:', error);

                if (error.response?.status === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                } else if (error.response?.status === 404) {
                    setError('Torre não encontrada!');
                } else if (error.response?.status === 403) {
                    setError('Você não tem permissão para editar esta torre.');
                } else {
                    setError(`Erro ao carregar dados: ${error.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        } else {
            setError('ID da torre não fornecido');
            setLoading(false);
        }
    }, [id]);

    const addCam = async (camera) => {
        try {
            const newCamsId = [
                ...camsNaTorre.map(c => c.id),
                camera.id
            ];

            await api.put(`/api/torres/${id}/`, {
                titulo: torre.titulo,
                cams_torres: newCamsId
            });

            setCamerasNaTorre(prev => [...prev, camera]);
            setCamerasDisponiveis(prev => prev.filter(c => c.id !== camera.id));

            alert(`Câmera "${camera.titulo}" adicionada à torre!`);
        } catch (error) {
            console.error('Erro ao adicionar câmera:', error);
            alert('Erro ao adicionar câmera. tente novamente.');
        }
    };

    const removeCamera = async (camera) => {
        try {
            if (!window.confirm(`Remover a câmera "${camera.titulo}" da torre?`)){
                return;
            }

            const novasCamerasIds = camerasNaTorre
                .filter(c => c.id !== camera.id)
                .map(c => c.id);

            // ✅ Atualiza a torre com a nova lista de câmeras
            await api.put(`/api/torres/${id}/`, {
                titulo: torre.titulo,
                cams_torres: novasCamerasIds
            });

            // ✅ Atualiza o estado local
            setCamerasNaTorre(prev => prev.filter(c => c.id !== camera.id));
            setCamerasDisponiveis(prev => [...prev, camera]);

            alert(`Câmera "${camera.nome || camera.titulo}" removida da torre!`);

        } catch (error) {
            console.error('Erro ao remover câmera:', error);
            alert('Erro ao remover câmera. Tente novamente.');
        }
    };
        
    const formattedDate = torre.created_at ? new Date(torre.created_at).toLocaleDateString("pt-BR") : "Data não disponível";
    const cams_details = torre.cams_details || [];

    return (
        <div>
            <div>
                Editar Torre
                <button className="btn-back" onClick={handleBack}>
                    Voltar
                </button>
            </div>

            {cams_details.map(cams => (
                <p key={cams.titulo}>
                    <strong>{cams.titulo || "Link não disponível"}</strong>
                </p>
            ))}
        </div>
    )
}

export default EditTorre;