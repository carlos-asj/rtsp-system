import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
    const [ isAuthorized, setIsAuthorized ] = useState(null); // em andamento

    useEffect(() => {
        auth()
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        if (!refreshToken) {
            setIsAuthorized(false);
            return;
        }
        
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
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            setIsAuthorized(false); // erro na requisição
        }
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;

            // Se o token expirou, não autoriza
            if (tokenExpiration < now) {
                await refreshToken();
            } else {
                setIsAuthorized(true); // Token válido
            }
        } catch (error) {
            console.log("Erro ao decodificar token:", error);
            setIsAuthorized(false);
            localStorage.removeItem(ACCESS_TOKEN); // Limpa token inválido
        }
    };

    if (isAuthorized === null) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <div>Carregando...</div>
            </div>
        );
    }

    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute;