import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import "../styles/EditTorrePage.css";

function EditTorrePage() {
    const { id } = useParams();
    const [torre, setTorre] = useState(null);
    const [camerasDisponiveis, setCamerasDisponiveis] = useState([]);
    const [camerasNaTorre, setCamerasNaTorre] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // ✅ Carrega os dados da torre e câmeras
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                console.log(`Buscando torre com ID: ${id}`);

                // ✅ Carrega a torre específica
                const torreResponse = await api.get(`/api/torres/${id}/`);
                setTorre(torreResponse.data);
                
                // ✅ Define as câmeras que já estão na torre
                const camsNaTorre = torreResponse.data.cams_details || [];
                setCamerasNaTorre(camsNaTorre);

                // ✅ Carrega TODAS as câmeras disponíveis
                const camerasResponse = await api.get("/api/cameras/");
                const todasCameras = Array.isArray(camerasResponse.data) ? camerasResponse.data : [];

                // ✅ Filtra apenas as câmeras que NÃO estão nesta torre
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

    // ✅ Função para adicionar câmera à torre
    const adicionarCamera = async (camera) => {
        try {
            // ✅ Cria uma nova lista de câmeras incluindo a nova
            const novasCamerasIds = [
                ...camerasNaTorre.map(c => c.id),
                camera.id
            ];

            // ✅ Atualiza a torre com a nova lista de câmeras
            await api.put(`/api/torres/${id}/`, {
                titulo: torre.titulo,
                cams_torres: novasCamerasIds
            });

            // ✅ Atualiza o estado local
            setCamerasNaTorre(prev => [...prev, camera]);
            setCamerasDisponiveis(prev => prev.filter(c => c.id !== camera.id));

            alert(`Câmera "${camera.nome || camera.titulo}" adicionada à torre!`);

        } catch (error) {
            console.error('Erro ao adicionar câmera:', error);
            alert('Erro ao adicionar câmera. Tente novamente.');
        }
    };

    // ✅ Função para remover câmera da torre
    const removerCamera = async (camera) => {
        try {
            if (!window.confirm(`Remover a câmera "${camera.nome || camera.titulo}" da torre?`)) {
                return;
            }

            // ✅ Cria uma nova lista de câmeras excluindo a removida
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

    // ✅ Função para voltar à lista
    const handleVoltar = () => {
        navigate('/torres');
    };

    if (loading) {
        return (
            <div className="edit-torre-page">
                <div className="loading">Carregando dados da torre...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="edit-torre-page">
                <div className="error-message">
                    <h2>Erro</h2>
                    <p>{error}</p>
                    <button onClick={handleVoltar} className="btn-voltar">
                        Voltar para a lista
                    </button>
                </div>
            </div>
        );
    }

    if (!torre) {
        return (
            <div className="edit-torre-page">
                <div className="error-message">
                    <h2>Torre não encontrada</h2>
                    <p>A torre solicitada não existe ou você não tem acesso.</p>
                    <button onClick={handleVoltar} className="btn-voltar">
                        Voltar para a lista
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-torre-page">
            {/* ✅ Cabeçalho */}
            <div className="page-header">
                <div className="header-info">
                    <h1>Gerenciar Torre: {torre.titulo}</h1>
                    <p className="torre-id">ID: {torre.id} | Data de criação: {torre.created_at ? new Date(torre.created_at).toLocaleDateString("pt-BR") : "N/A"}</p>
                </div>
                <button className="btn-voltar" onClick={handleVoltar}>
                    ← Voltar para a lista
                </button>
            </div>

            <div className="content-grid">
                {/* ✅ Seção: Câmeras na Torre */}
                <div className="section">
                    <div className="section-header">
                        <h2>Câmeras na Torre</h2>
                        <span className="badge">{camerasNaTorre.length} câmeras</span>
                    </div>
                    
                    {camerasNaTorre.length > 0 ? (
                        <div className="cameras-list">
                            {camerasNaTorre.map(camera => (
                                <div key={camera.id} className="camera-card">
                                    <div className="camera-info">
                                        <h3>{camera.nome || camera.titulo}</h3>
                                        <p><strong>Localização:</strong> {camera.localizacao || camera.endereco || 'Não informada'}</p>
                                        <p><strong>Status:</strong> {camera.status || 'Ativa'}</p>
                                    </div>
                                    <div className="camera-actions">
                                        <button 
                                            className="btn-remover"
                                            onClick={() => removerCamera(camera)}
                                            title="Remover câmera da torre"
                                        >
                                            ✕ Remover
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>Nenhuma câmera adicionada a esta torre.</p>
                            <p>Adicione câmeras da lista de disponíveis.</p>
                        </div>
                    )}
                </div>

                {/* ✅ Seção: Câmeras Disponíveis */}
                <div className="section">
                    <div className="section-header">
                        <h2>Câmeras Disponíveis</h2>
                        <span className="badge">{camerasDisponiveis.length} disponíveis</span>
                    </div>
                    
                    {camerasDisponiveis.length > 0 ? (
                        <div className="cameras-list">
                            {camerasDisponiveis.map(camera => (
                                <div key={camera.id} className="camera-card">
                                    <div className="camera-info">
                                        <h3>{camera.nome || camera.titulo}</h3>
                                        <p><strong>Localização:</strong> {camera.localizacao || camera.endereco || 'Não informada'}</p>
                                        <p><strong>Status:</strong> {camera.status || 'Disponível'}</p>
                                    </div>
                                    <div className="camera-actions">
                                        <button 
                                            className="btn-adicionar"
                                            onClick={() => adicionarCamera(camera)}
                                            title="Adicionar câmera à torre"
                                        >
                                            + Adicionar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>Nenhuma câmera disponível.</p>
                            <p>Todas as câmeras já estão em torres.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EditTorrePage;