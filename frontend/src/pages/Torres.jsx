import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListTorres from "../components/ListTorres";
import api from "../api";

function Torres() {
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

    const deleteTorre = (id) => {
        api.delete(`/api/torres/${id}/`).then((res) => {
            if (res.status === 204) alert("Torre deletada!");
            else alert("Falha ao deletar torre. ");
            getTorres();
        }).catch((error) => alert(error));
    }

    const handleLogout = () => {
        navigate('/logout');
    };

    const handleBack = () => {
        navigate('/');
    };

    const handleCadTorres = () => {
        navigate('/cadtorre')
    }

    return(
        <div>
            <a className="btn-logout" onClick={handleLogout}>
                Logout
            </a>
            <a className="btn-back" onClick={handleBack}>Voltar</a>
            <div className="main-container">
                <div className="title2">
                    TORRES ({torres.length})
                </div>
                <div className="">
                    {torres.map((torre) => (
                        <ListTorres torre={torre} key={torre.id} onDelete={deleteTorre} />
                    ))}
                </div>
                <button className="btn-cadcams" onClick={handleCadTorres}>Adicionar</button>
                
            </div>
        </div>
    )
}

export default Torres;