/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import api from "../api";
import "../styles/FormTorre.css";

function FormTorre({ onTorreCadastrada }) {
    const [formData, setFormData] = useState({
        titulo: '',
        cams_torres: []
    });

    const [loading, setLoading] = useState(false);
    const [cameras, setCameras] = useState([]);

    useEffect (() => {
        getData();
    }, []);

    const getData = async () => {
        setLoading(true);
        try{
            const resCams = await api.get('/api/cameras/');
            setCameras(Array.isArray(resCams.data) ? resCams.data : []);
        } catch (error) {
            console.log(`Erro ao buscar dados:`, error);
            setCameras([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, multiple, options } = e.target;

        if (multiple) {
            // Para selects múltiplos
            const selectedValues = Array.from(options)
                .filter(option => option.selected)
                .map(option => option.value);
            
            setFormData(prev => ({
                ...prev,
                [name]: selectedValues
            }));
        } else {
            // Para inputs normais
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.titulo.trim()) {
            alert('Por favor, preencha o título da torre');
            return;
        }

        try {
            const response = await api.post('api/torres/', formData);

            setFormData({
                titulo: '',
                cams_torres: []
            });

            if (onTorreCadastrada){
                onTorreCadastrada();
            }

            alert('Torre cadastrada com sucesso!');

        } catch (error) {
            console.error('Erro ao cadastrar torre:', error);
            alert('Erro ao cadastrar torre. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (loading){
        return <div>Carregando dados...</div>
    };

    return (
        <div className="cad-torre">
            <form onSubmit={handleSubmit}>
                <label htmlFor="titulo">Título da torre:</label>
                <input type="text" id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required />

                <button type="submit">
                    Cadastrar torre
                </button>
            </form>
        </div>
    );
};
 export default FormTorre;