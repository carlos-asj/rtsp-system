import { useNavigate } from "react-router-dom";
import FormTorre from "../components/FormTorre";

function CadTorre() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/torres');
    };

    const handleLogout = () => {
        navigate('/logout');
    };

    return(
        <div>
            <button className="btn-back"onClick={handleBack}>Voltar</button>
            <button className="btn-logout"onClick={handleLogout}>Logout</button>
            <FormTorre />
        </div>
    )
};

export default CadTorre;