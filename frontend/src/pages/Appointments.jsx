
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../api';

export default function Appointments() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await appointmentService.getAll();
                // Sort by date descending
                setAppointments(res.data.sort((a, b) => new Date(`${b.fecha}T${b.horaInicio}`) - new Date(`${a.fecha}T${a.horaInicio}`)));
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    if (loading) return <div className="p-4">Cargando citas...</div>;

    return (
        <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Mis Citas</h1>

            {appointments.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
                    No tienes citas registradas.
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {appointments.map(app => (
                        <div key={app.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium text-indigo-600 truncate">
                                        {new Date(app.fecha).toLocaleDateString()} - {app.horaInicio}
                                    </div>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${app.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                                            app.estado === 'CONFIRMADA' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {app.estado}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            {user.rol === 'PACIENTE'
                                                ? `Doctor: ${app.nombreMedico || 'No asignado'} (${app.especialidad || 'General'})`
                                                : `Paciente: ${app.nombrePaciente || 'Desconocido'}`
                                            }
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                        <p>{app.tipo}</p>
                                    </div>
                                </div>
                                {app.enlaceReunion && (
                                    <div className="mt-2 text-sm">
                                        <a href={app.enlaceReunion} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                            Unirse a la reunión &rarr;
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
