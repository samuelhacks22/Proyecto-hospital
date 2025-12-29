
import { useState, useEffect } from 'react';
import { appointmentService } from '../api';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await appointmentService.getAll();
                // Sort by date descending
                setAppointments(res.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMADA': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'PENDIENTE': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'CANCELADA': return 'bg-rose-100 text-rose-800 border-rose-200';
            case 'COMPLETADA': return 'bg-slate-100 text-slate-800 border-slate-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="p-4 text-center text-slate-500">Cargando citas...</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Mis Citas</h1>

            {appointments.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-4">
                        <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No tienes citas registradas</h3>
                    <p className="mt-1 text-slate-500">Cuando reserves una cita, aparecerá aquí.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {appointments.map((app) => (
                        <div key={app.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="h-12 w-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold border border-brand-100">
                                            {new Date(app.fecha).getDate()}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            {app.nombreMedico ? `Dr. ${app.nombreMedico}` : app.nombrePaciente}
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            {new Date(app.fecha).toLocaleDateString()} a las {app.horaInicio.slice(0, 5)}
                                        </p>
                                        <p className="text-sm text-slate-500 mt-1 capitalize">{app.tipo.toLowerCase()}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(app.estado)}`}>
                                        {app.estado}
                                    </span>

                                    {app.enlaceReunion && app.estado !== 'CANCELADA' && (
                                        <a
                                            href={app.enlaceReunion}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                            Unirse a la reunión
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
