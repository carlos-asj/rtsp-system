import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }){
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register"

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post(route, {username, password})
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                navigate("/login/")
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className="">
            <div className="login-container inset-shadow-[-2px_2px_7px_rgba(255,255,255,0.8)]" >
                <form onSubmit={handleSubmit} className="form-group">
                    <h1>{name}</h1>
                    <label>Usuário</label>
                    <input className="form-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <br />
                    <label>Senha</label>
                    <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {loading && <LoadingIndicator />}
                    <button type="submit" className="btn-entrar">
                        {method === "login" ? "Entrar" : "Registrar"}
                    </button>
                </form>
                {method !== "register" && (
                    <div className="registro-link" onClick={handleRegister}>
                        Não possui uma conta? <a>
                            Registre-se
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Form;