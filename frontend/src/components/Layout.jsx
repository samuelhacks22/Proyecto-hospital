
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';

const NavLink = ({ to, children, active, onClick }) => (
    <Link
        to={to}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors mb-1 ${active
            ? 'bg-brand-50 text-brand-700'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
        onClick={onClick}
    >
        {children}
    </Link>
);

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Desktop Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-16 border-b border-slate-100 px-4">
                        <Link to="/dashboard" className="text-2xl font-bold text-brand-600 tracking-tight">
                            MediFlow
                        </Link>
                    </div>

                    {/* Nav Links */}
                    <div className="flex-1 overflow-y-auto py-6 px-3">
                        <nav className="space-y-1">
                            <NavLink to="/dashboard" active={isActive('/dashboard')} onClick={() => setMobileMenuOpen(false)}>Inicio</NavLink>

                            {/* Patient Links */}
                            {user?.rol === 'PACIENTE' && (
                                <>
                                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Paciente</div>
                                    <NavLink to="/book-appointment" active={isActive('/book-appointment')} onClick={() => setMobileMenuOpen(false)}>Reservar Cita</NavLink>
                                    <NavLink to="/appointments" active={isActive('/appointments')} onClick={() => setMobileMenuOpen(false)}>Mis Citas</NavLink>
                                    <NavLink to="/results" active={isActive('/results')} onClick={() => setMobileMenuOpen(false)}>Resultados</NavLink>
                                </>
                            )}

                            {/* Doctor Links */}
                            {user?.rol === 'MEDICO' && (
                                <>
                                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Médico</div>
                                    <NavLink to="/appointments" active={isActive('/appointments')} onClick={() => setMobileMenuOpen(false)}>Mis Citas</NavLink>
                                    <NavLink to="/results" active={isActive('/results')} onClick={() => setMobileMenuOpen(false)}>Ver Resultados</NavLink>
                                </>
                            )}

                            {/* Clinic Links */}
                            {user?.rol === 'CLINICA' && (
                                <>
                                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Clínica</div>
                                    <NavLink to="/clinic" active={isActive('/clinic')} onClick={() => setMobileMenuOpen(false)}>Panel Clínica</NavLink>
                                </>
                            )}

                            {/* Admin Links */}
                            {user?.rol === 'ADMIN' && (
                                <>
                                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Admin</div>
                                    <NavLink to="/admin" active={isActive('/admin')} onClick={() => setMobileMenuOpen(false)}>Administración</NavLink>
                                </>
                            )}
                        </nav>
                    </div>

                    {/* User & Logout */}
                    <div className="border-t border-slate-100 p-4 bg-slate-50/50">
                        <div className="flex items-center mb-4">
                            <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold border-2 border-white shadow-sm">
                                {user?.nombreCompleto?.charAt(0) || 'U'}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-slate-900 truncate max-w-[140px]">{user?.nombreCompleto}</p>
                                <p className="text-xs text-slate-500 font-medium capitalize">{user?.rol?.toLowerCase()}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Link to="/profile" className="text-center px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50">
                                Perfil
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-center px-3 py-2 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 shadow-sm shadow-red-200"
                            >
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all duration-300">
                {/* Mobile Header */}
                <header className="flex items-center justify-between p-4 bg-white border-b border-slate-200 md:hidden sticky top-0 z-30">
                    <span className="font-bold text-lg text-brand-600">MediConnect</span>
                    <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-slate-500 rounded-md hover:bg-slate-100">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </header>

                <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
