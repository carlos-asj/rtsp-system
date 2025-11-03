import React from "react";

function ListCamera({ camera, onDelete }) {
    if (!camera) {
        return <div>Erro: Dados da câmera não disponíveis</div>;
    }

    const formattedDate = camera.created_at 
        ? new Date(camera.created_at).toLocaleDateString("pt-BR")
        : "Data não disponível";

    const linksRTSP = camera.cam_id || [];
    const hasLinks = Array.isArray(linksRTSP) && linksRTSP.length > 0;

    return (
        <div>
            <h3>{camera.titulo || "Sem título"}</h3>
            <p>Usuário: {camera.user || "Não informado"}</p>
            <p>Domínio: {camera.dominio || "Não informado"}</p>
            <p>Porta RTSP: {camera.porta_rtsp || "Não informada"}</p>
            <p>N/S: {camera.ns || "Não informado"}</p>
            <p>MAC: {camera.mac || "Não informado"}</p>
            
            {/* ✅ LINKS RTSP COM VERIFICAÇÃO SEGURA */}
            <div>
                Links RTSP:
                    {linksRTSP.map(link => (
                        <p href={link.rtsp}>
                            {link.rtsp || "Link não disponível"}
                        </p>
                    ))}
            </div>

            <p><strong>Data de criação:</strong> {formattedDate}</p>
            <button 
                onClick={() => onDelete(camera.id)}
            >
                Deletar
            </button>
        </div>
    );
}

export default ListCamera;