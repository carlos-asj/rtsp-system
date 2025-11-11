import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashCams from "../components/DashCams";
import DashTorres from "../components/DashTorres";
import ListTorres from "../components/ListTorres";
import api from "../api";
import "../styles/Home.css";

function Home() {

    const [cameras, setCameras] = useState([]);
    const [torres, setTorres] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getCameras();
        getTorres();
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

    const getTorres = async () => {
        try {
            const response = await api.get("/api/torres/");
            setTorres(response.data);
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                window.location.href = '/login';
            } else {
                alert(`Erro: ${error.message}`);
            }
        }
    }

    const handleCameras = () => {
        navigate('/cameras');
    };

    const handleLogout = () => {
        navigate('/logout');
    };

    const handleTorres = () => {
        navigate('/torres');
    };

    return (
        <div>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
            <div>
                <div className="main-container">
                    <button className="btn-cams" onClick={handleCameras}>
                        <a className="title">CÂMERAS</a>
                    </button>
                    <div className="camera">
                        {cameras.map((camera) => (
                            <DashCams camera={camera} key={camera.id} />
                        ))}
                    </div>
                </div>
                <div className="main-container">
                    <button className="btn-cams" onClick={handleTorres}>
                        <a className="title">TORRES</a>
                    </button>
                    <div className="camera">
                        {torres.map((torre) => (
                            <DashTorres torre={torre} key={torre.id} />
                        ))}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Home;