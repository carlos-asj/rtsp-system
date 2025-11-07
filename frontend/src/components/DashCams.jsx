/* eslint-disable no-unused-vars */
import React from "react";
import "../styles/DashCams.css";

function DashCams({ camera }) {
    if (!camera) {
        return <div>Erro: Dados da câmera não disponíveis</div>;
    }

    const formattedDate = camera.created_at 
        ? new Date(camera.created_at).toLocaleDateString("pt-BR")
        : "Data não disponível";

    return (
        <div className="main-container">
            <div className="camera-item">
                <div className="camera-info">
                    <h3 className="title2">{camera.titulo || "Sem título"}</h3>
                    <p className="subtitle">Domínio: {camera.dominio || "Não informado"}</p>
                    <p className="subtitle"><strong>Data de criação:</strong> {formattedDate}</p>
                </div>
            </div>
        </div>
    );
}

export default DashCams;