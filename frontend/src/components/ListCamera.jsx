/* eslint-disable no-unused-vars */
import React from "react";

function ListCamera({ camera, onDelete }) {
    if (!camera) {
        return <div>Erro: Dados da câmera não disponíveis</div>;
    }

    const formattedDate = camera.created_at 
        ? new Date(camera.created_at).toLocaleDateString("pt-BR")
        : "Data não disponível";

    const linkRTSP = camera.link_rtsp || [];
    const hasLinks = Array.isArray(linkRTSP) && linkRTSP.length > 0;

    return (
        <div className="camera-item">
            <div className="camera-info">
                <h3>{camera.titulo || "Sem título"}</h3>
                <p>Usuário: {camera.user || "Não informado"}</p>
                <p>Domínio: {camera.dominio || "Não informado"}</p>
                <p>Porta RTSP: {camera.porta_rtsp || "Não informada"}</p>
                <p>N/S: {camera.ns || "Não informado"}</p>
                <p>MAC: {camera.mac || "Não informado"}</p>
                {linkRTSP.map(link => (
                    <p key={link.rtsp}>
                        Link RTSP: {link.rtsp || "Link não disponível"}
                    </p>
                ))}
                <p><strong>Data de criação:</strong> {formattedDate}</p>
            </div>
            <div className="camera-actions">
                <button 
                    onClick={() => onDelete(camera.id)}
                >
                    Deletar
                </button>
            </div>
        </div>
    );
}

export default ListCamera;