import api from "../api";
import React, { useState } from "react"
import "../styles/CadCam.css"

function CadCamera({ onCameraCadastrada  }) {
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

            if (onCameraCadastrada) {
                onCameraCadastrada();
            }
            
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            alert('Erro ao cadastrar item');

        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="cad-container">
            <h1 className="title2">CADASTRO DE CÂMERAS</h1>
            <form onSubmit={handleSubmit} className="cam-form">
                <label className="lbl-cam" htmlFor="titulo">Título:</label>
                
                <input className="inpt-cam" type="text" id="titulo" name="titulo" value={formData.titulo} required onChange={handlChange}/>
                
                <label className="lbl-cam" htmlFor="user">Usuário:</label>
                
                <input className="inpt-cam" type="text" id="user" name="user" value={formData.user} required onChange={handlChange}/>
                
                <label className="lbl-cam" htmlFor="senha">Senha:</label>
                
                <input className="inpt-cam" type="password" id="senha" name="senha" value={formData.senha} required onChange={handlChange}/>
                
                <label className="lbl-cam" htmlFor="porta_rtsp">Porta RTSP:</label>
                
                <input className="inpt-cam" type="text" id="porta_rtsp" name="porta_rtsp" value={formData.porta_rtsp} required onChange={handlChange}/>
                
                <label className="lbl-cam" htmlFor="dominio">Domínio:</label>
                
                <input className="inpt-cam" type="text" id="dominio" name="dominio" value={formData.dominio} required onChange={handlChange}/>
                
                <label className="lbl-cam" htmlFor="ns">N/S:</label>
                
                <input className="inpt-cam" type="text" id="ns" name="ns" value={formData.ns} onChange={handlChange}/>
                
                <label className="lbl-cam" htmlFor="mac">MAC:</label>
                
                <input className="inpt-cam" type="text" id="mac" name="mac" value={formData.mac} onChange={handlChange}/>
                
                <button className="cad-btn" type="submit" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
            </form>
        </div>
    )
};

export default CadCamera;