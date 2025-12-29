
import { useAuth } from '../context/AuthContext';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center">
                            <Link to="/dashboard" className="font-bold text-xl text-indigo-600 mr-8">
                                Plataforma Médica
                            </Link>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <Link
                                        to="/dashboard"
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/dashboard') ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        Inicio
                                    </Link>
                                    <Link
                                        to="/book-appointment"
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/book-appointment') ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        Reservar Cita
                                    </Link>
                                    <Link
                                        to="/appointments"
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/appointments') ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        Mis Citas
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/profile') ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        Mi Perfil
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="hidden sm:block text-gray-700">Hola, {user?.nombreCompleto} ({user?.rol})</span>
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
                <Outlet />
            </main>
        </div>
    );
}
