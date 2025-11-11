import { useEffect, useState } from "react";
import api from "../api";

function FormTorre({ onTorreCadastrada }) {
    const [formData, setFormData] = useState({
        titulo: '',
        cams_torres: [],
        usuarios_autorizados: []
    });

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [cameras, setCameras] = useState([]);

    useEffect (() => {
        getData();
    });

    const getData = async () => {
        setLoading(true);
        try{
            const resCams = await api.get('/api/cameras/');
            setCameras(resCams.data);

            const resUsers = await api.get('/api/users/');
            setUsers(resUsers.data);

        } catch (error) {
            console.log(`Erro ao buscar dados:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, options } = e.target;

        if (name === 'cams_torres' || name === 'usuarios_autorizados'){
            const selectedValues = Array.from(options).filter(option => option.selected).map(option => option.value);

            setFormData(prev => ({
                ...prev,
                [name]: selectedValues
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onTorreCadastrada(formData);

        setFormData({
            titulo: '',
            cams_torres: [],
            usuarios_autorizados: []
        });
    };

    if (loading){
        return <div>Carregando dados...</div>
    };

    return (
        <div className="color: white">
            <form onSubmit={handleSubmit}>
                <label htmlFor="titulo">Título da torre:</label>
                <input type="text" id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required />

                <label htmlFor="cams_torres">Câmeras da torre:</label>
                <select id="cams_torres" name="cams_torres" value={formData.cams_torres} onChange={handleChange} multiple size="4">
                    {cameras.map(camera => (
                        <option key={camera.id} value={camera.id}>
                            {camera.nome} - {camera.localizacao}
                        </option>
                    ))}
                </select>

                <label htmlFor="usuarios_autorizados">Usuários autorizados:</label>
                <select name="usuarios_autorizados" id="usuarios_autorizados" value={formData.usuarios_autorizados} onChange={handleChange} multiple size="4" >
                    {users.map(usuario => (
                        <option key={usuario.id} value={usuario.id}>
                            {usuario.id}
                        </option>
                    ))}
                </select>

                <button type="submit">
                    Cadastrar torre
                </button>
            </form>
        </div>
    );
};
 export default FormTorre;