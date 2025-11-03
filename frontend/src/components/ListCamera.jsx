import React from "react";

function ListCamera({ camera, onDelete }) {
    const formattedDate = new Date(camera.created_at).toLocaleDateString("pt-BR");

    return (
        <div>
            <p>{camera.titulo}</p>
            <p>{camera.user}</p>
            <p>{camera.senha}</p>
            <p>{camera.porta_rtsp}</p>
            <p>{camera.dominio}</p>
            <p>{camera.ns}</p>
            <p>{camera.mac}</p>
            <p>{formattedDate}</p>
            <button onClick={() => onDelete(camera.id)}>Delete</button>
        </div>
    )
}

export default ListCamera;