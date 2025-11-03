import api from "../api";
import React, { useState } from "react"

function CadCamera() {
    const [formData, setFormData] = useState({
        titulo: '',
        user: '',
        senha: '',
        porta_rtsp: '',
        dominio: '',
        ns: '',
        mac: ''
    });

    const [loading, setLoading] = useState(false);

    const handlChange = (e) => {
        const{ name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/api/cameras/', formData);
            console.log('Item cadastrado:', response.data);
            
            // LIMPA O FORMULÁRIO
            setFormData({
                titulo: '',
                user: '',
                senha: '',
                porta_rtsp: '',
                dominio: '',
                ns: '',
                mac: ''
            });
            
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            alert('Erro ao cadastrar item');

        } finally {
            setLoading(false);
        }
    };

    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="titulo">Título:</label>
            <br />
            <input type="text" id="titulo" name="titulo" required onChange={handlChange}/>
            <br />
            <label htmlFor="user">Usuário:</label>
            <br />
            <input type="text" id="user" name="user" required onChange={handlChange}/>
            <br />
            <label htmlFor="senha">Senha:</label>
            <br />
            <input type="password" id="senha" name="senha" required onChange={handlChange}/>
            <br />
            <label htmlFor="porta_rtsp">Porta RTSP:</label>
            <br />
            <input type="text" id="porta_rtsp" name="porta_rtsp" required onChange={handlChange}/>
            <br />
            <label htmlFor="dominio">Domínio:</label>
            <br />
            <input type="text" id="dominio" name="dominio" required onChange={handlChange}/>
            <br />
            <label htmlFor="ns">N/S:</label>
            <br />
            <input type="text" id="ns" name="ns" onChange={handlChange}/>
            <br />
            <label htmlFor="mac">MAC:</label>
            <br />
            <input type="text" id="mac" name="mac" onChange={handlChange}/>
            <br />
            <button type="submit" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
        </form>
    )
};

export default CadCamera;