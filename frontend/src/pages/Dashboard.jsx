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
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="font-bold text-xl text-indigo-600">Plataforma Médica</div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-700">Hola, {user?.fullName} ({user?.role})</span>
                            <button
                                onClick={handleLogout}
                                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="rounded-lg border-4 border-dashed border-gray-200 p-10 text-center text-gray-500 h-96 flex items-center justify-center">
                        Aquí irá el contenido principal (Citas, Historial, etc.)
                    </div>
                </div>
            </main>
        </div>
    );
}
