import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="px-4 py-6 sm:px-0">
            <div className="rounded-lg border-4 border-dashed border-gray-200 p-10 text-center text-gray-500 h-96 flex items-center justify-center">
                Aquí irá el contenido principal (Citas, Historial, etc.)
            </div>
        </div>
    );
}
