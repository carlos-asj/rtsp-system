/* eslint-disable no-unused-vars */
import React from "react";

function DashCams({ camera, onDelete }) {
    if (!camera) {
        return <div>Erro: Dados da câmera não disponíveis</div>;
    }

    const formattedDate = camera.created_at 
        ? new Date(camera.created_at).toLocaleDateString("pt-BR")
        : "Data não disponível";

    const linkRTSP = camera.link_rtsp || [];
    const hasLinks = Array.isArray(linkRTSP) && linkRTSP.length > 0;

    return (
        <div className="main-container">
            <div className="camera-item">
                <div className="camera-info">
                    <h3 className="title">{camera.titulo || "Sem título"}</h3>
                    <p>Domínio: {camera.dominio || "Não informado"}</p>
                    <p><strong>Data de criação:</strong> {formattedDate}</p>
                </div>
            </div>
        </div>
    );
}

export default DashCams;