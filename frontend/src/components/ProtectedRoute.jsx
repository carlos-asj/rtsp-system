import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
    const [ isAuthorized, setIsAuthorized ] = useState(null); // em andamento

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            if (res.status === 200){
                localStorage.setItem(ACCESS_TOKEN, res.data.access) // salva o token novo
                setIsAuthorized(true) // autoriza o acesso
            } else {
                setIsAuthorized(false) // refresh falhou
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false); // erro na requisição
        }
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token){ // sem token não autoriza
            setIsAuthorized(false)
            return;
        }
        
        // decodifica e autoriza o token
        const decode = jwtDecode(token);
        const tokenExpiration = decode.exp; // Timestamp em segundos
        const now = Date.now() / 1000; // Timestamp atual em segundos

        if (tokenExpiration < now) {
            await refreshToken(); // Quando o token expira, tenta atualizar
        } else {
            setIsAuthorized(true) // Token válido
        }
    };

    if(isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute;