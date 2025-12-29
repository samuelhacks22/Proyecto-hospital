import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { appointmentService } from '../api';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [nextAppointment, setNextAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await appointmentService.getAll();
                const now = new Date();
                // Filter upcoming appointments and sort by date
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

    return (
        <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Panel de Control</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Next Appointment Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Próxima Cita
                        </h3>
                        <div className="mt-5">
                            {loading ? (
                                <p className="text-gray-500">Cargando...</p>
                            ) : nextAppointment ? (
                                <div>
                                    <div className="text-xl font-bold text-indigo-600">
                                        {new Date(nextAppointment.fecha).toLocaleDateString()} - {nextAppointment.horaInicio}
                                    </div>
                                    <p className="mt-2 text-gray-600">
                                        {user.rol === 'PACIENTE'
                                            ? `Dr. ${nextAppointment.nombreMedico} (${nextAppointment.especialidad})`
                                            : `Paciente: ${nextAppointment.nombrePaciente}`}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">{nextAppointment.tipo}</p>
                                    {nextAppointment.enlaceReunion && (
                                        <a href={nextAppointment.enlaceReunion} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500">
                                            Unirse a Reunión
                                        </a>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-gray-500">No tienes citas próximas.</p>
                                    {user.rol === 'PACIENTE' && (
                                        <Link to="/book-appointment" className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                                            Reservar Cita
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Acciones Rápidas
                        </h3>
                        <div className="mt-5 flex flex-col gap-4">
                            {user.rol === 'PACIENTE' && (
                                <Link to="/book-appointment" className="text-center w-full border border-transparent rounded-md shadow-sm py-2 px-4 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none">
                                    Reservar Nueva Cita
                                </Link>
                            )}
                            <Link to="/appointments" className="text-center w-full border border-gray-300 rounded-md shadow-sm py-2 px-4 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                                Ver Historial de Citas
                            </Link>
                            <Link to="/profile" className="text-center w-full border border-gray-300 rounded-md shadow-sm py-2 px-4 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                                Editar Perfil
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
