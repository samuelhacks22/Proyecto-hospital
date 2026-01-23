
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { appointmentService } from '../api';

export default function Dashboard() {
    const { user } = useAuth();
    const [nextAppointment, setNextAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await appointmentService.getAll();
                const now = new Date();
                const upcoming = res.data
                    .filter(app => new Date(`${app.fecha}T${app.horaInicio}`) > now && app.estado !== 'CANCELADA')
                    .sort((a, b) => new Date(`${a.fecha}T${a.horaInicio}`) - new Date(`${b.fecha}T${b.horaInicio}`));

                if (upcoming.length > 0) {
                    setNextAppointment(upcoming[0]);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const QuickAction = ({ to, title, icon, primary }) => (
        <Link
            to={to}
            className={`flex items-center p-4 rounded-xl border transition-all duration-200 ${primary
                    ? 'bg-brand-50 border-brand-200 hover:shadow-md hover:border-brand-300'
                    : 'bg-white border-slate-200 hover:shadow-md hover:border-slate-300'
                }`}
        >
            <div className={`p-3 rounded-lg ${primary ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {icon}
            </div>
            <div className="ml-4">
                <h3 className={`font-semibold ${primary ? 'text-brand-900' : 'text-slate-900'}`}>{title}</h3>
                <span className={`text-xs ${primary ? 'text-brand-600' : 'text-slate-500'}`}>Click para ir</span>
            </div>
        </Link>
    );

    return (
        <div className="max-w-5xl mx-auto">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-brand-600 to-brand-500 rounded-2xl p-8 mb-8 text-white shadow-lg shadow-brand-500/20">
                <h1 className="text-3xl font-bold mb-2">Hola, {user.nombreCompleto.split(' ')[0]} 👋</h1>
                <p className="text-brand-100 text-lg">Bienvenido a tu portal de salud. ¿Cómo podemos ayudarte hoy?</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Section */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Next Appointment */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Tu Próxima Cita
                        </h2>

                        {loading ? (
                            <div className="animate-pulse h-40 bg-slate-200 rounded-xl"></div>
                        ) : nextAppointment ? (
                            <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-sm font-medium text-brand-600 uppercase tracking-wide mb-1">
                                                {new Date(nextAppointment.fecha).toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })}
                                            </p>
                                            <h3 className="text-2xl font-bold text-slate-900">{nextAppointment.horaInicio.slice(0, 5)}</h3>
                                        </div>
                                        <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-full border border-brand-100">
                                            {nextAppointment.tipo}
                                        </span>
                                    </div>

                                    <div className="flex items-center mb-6">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-slate-900">
                                                {user.rol === 'PACIENTE' ? `Dr. ${nextAppointment.nombreMedico}` : nextAppointment.nombrePaciente}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {user.rol === 'PACIENTE' ? nextAppointment.especialidad : 'Paciente'}
                                            </p>
                                        </div>
                                    </div>

                                    {nextAppointment.enlaceReunion && (
                                        <a href={nextAppointment.enlaceReunion} target="_blank" rel="noopener noreferrer"
                                            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                                        >
                                            Unirse a Video Consulta
                                        </a>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
                                    <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h3 className="text-lg font-medium text-slate-900">Sin citas próximas</h3>
                                <p className="mt-1 text-sm text-slate-500">No tienes ninguna cita programada pronto.</p>
                                {user.rol === 'PACIENTE' && (
                                    <Link to="/book-appointment" className="mt-4 inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-500">
                                        Reservar ahora &rarr;
                                    </Link>
                                )}
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar Section */}
                <div className="space-y-6">
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Acciones Rápidas</h2>
                        <div className="grid grid-cols-1 gap-3">
                            {user.rol === 'PACIENTE' && (
                                <QuickAction
                                    to="/book-appointment"
                                    title="Nueva Cita"
                                    primary
                                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
                                />
                            )}
                            <QuickAction
                                to="/appointments"
                                title="Historial"
                                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                            />
                            <QuickAction
                                to="/profile"
                                title="Mi Perfil"
                                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                            />
                        </div>
                    </section>

                    <div className="bg-brand-50 rounded-xl p-6 border border-brand-100">
                        <h3 className="font-semibold text-brand-800 mb-2">¿Necesitas ayuda?</h3>
                        <p className="text-sm text-brand-600 mb-4">Contacta a soporte si tienes problemas con la plataforma.</p>
                        <button className="text-sm font-medium text-brand-700 underline hover:text-brand-800">Ver preguntas frecuentes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
