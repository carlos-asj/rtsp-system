import { useNavigate } from "react-router-dom";
import CadCamera from "../components/CadCamera";

function Cadastro() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/cameras');
    };

    const handleLogout = () => {
        navigate('/logout');
    };

    return(
        <div>
            <button className="btn-back" onClick={handleBack}>Voltar</button>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
            <CadCamera />
        </div>
    )

}

export default Cadastro;