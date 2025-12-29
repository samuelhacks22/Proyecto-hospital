
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService, appointmentService } from '../api';

export default function BookAppointment() {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await doctorService.getAll();
                setDoctors(res.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const handleSelectDoctor = async (doctor) => {
        setSelectedDoctor(doctor);
        setAvailability([]);
        setSelectedDate('');
        setSelectedTime('');
        try {
            const res = await doctorService.getAvailability(doctor.id);
            setAvailability(res.data);
        } catch (error) {
            console.error('Error fetching availability:', error);
        }
    };

    const handleBook = async () => {
        if (!selectedDoctor || !selectedDate || !selectedTime) return;
        setBooking(true);
        try {
            await appointmentService.create({
                medicoId: selectedDoctor.id,
                fecha: selectedDate,
                horaInicio: selectedTime,
                notas
            });
            alert('¡Cita reservada con éxito!');
            navigate('/dashboard');
        } catch (error) {
            alert('Error al reservar cita');
            setBooking(false);
        }
    };

    const getNextDates = (dayOfWeek) => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 28; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            if (d.getDay() === dayOfWeek) {
                dates.push(d.toISOString().split('T')[0]);
            }
        }
        return dates;
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900">Reservar una Cita</h1>
                <p className="mt-2 text-slate-600">Encuentra al especialista adecuado y agenda tu consulta en minutos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map(doctor => (
                    <div
                        key={doctor.id}
                        onClick={() => handleSelectDoctor(doctor)}
                        className={`cursor-pointer rounded-xl border p-6 transition-all duration-200 relative overflow-hidden group ${selectedDoctor?.id === doctor.id
                                ? 'border-brand-500 ring-2 ring-brand-200 bg-brand-50'
                                : 'border-slate-200 bg-white hover:shadow-lg hover:border-brand-300'
                            }`}
                    >
                        {selectedDoctor?.id === doctor.id && (
                            <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                                Seleccionado
                            </div>
                        )}
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xl font-bold border-2 border-white shadow-sm">
                                {doctor.nombreCompleto.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{doctor.nombreCompleto}</h3>
                                <p className="text-sm text-brand-600 font-medium">{doctor.especialidad}</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm text-slate-500">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
                                {doctor.precioConsulta ? `$${doctor.precioConsulta}` : 'Consultar precio'}
                            </div>
                            {doctor.verificado && (
                                <div className="flex items-center text-accent-600">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Verificado
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {selectedDoctor && (
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in-up">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800">Horarios Disponibles para {selectedDoctor.nombreCompleto}</h2>
                    </div>
                    <div className="p-6">
                        {availability.length === 0 ? (
                            <p className="text-slate-500 text-center py-4">No hay horarios disponibles configurados para este médico.</p>
                        ) : (
                            <div className="space-y-6">
                                {availability.map(slot => (
                                    <div key={slot.id}>
                                        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">
                                            {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][slot.diaSemana]}
                                            <span className="ml-2 font-normal text-slate-500 normal-case">
                                                ({slot.horaInicio.slice(0, 5)} - {slot.horaFin.slice(0, 5)})
                                            </span>
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {getNextDates(slot.diaSemana).map(date => (
                                                <button
                                                    key={date}
                                                    onClick={() => {
                                                        setSelectedDate(date);
                                                        setSelectedTime(slot.horaInicio); // Simplifying to start time for MVP
                                                    }}
                                                    className={`px-4 py-2 text-sm rounded-lg border font-medium transition-all duration-200 ${selectedDate === date && selectedTime === slot.horaInicio
                                                            ? 'bg-brand-600 text-white border-brand-600 shadow-md transform scale-105'
                                                            : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300 hover:bg-brand-50'
                                                        }`}
                                                >
                                                    {new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedDate && (
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Notas adicionales (opcional)</label>
                                <textarea
                                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                    rows="3"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Describe brevemente el motivo de tu consulta..."
                                ></textarea>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={handleBook}
                                        disabled={booking}
                                        className={`px-6 py-3 rounded-lg text-white font-bold shadow-lg shadow-brand-500/30 transition-all ${booking ? 'bg-slate-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 hover:-translate-y-0.5'
                                            }`}
                                    >
                                        {booking ? 'Procesando...' : 'Confirmar Reserva'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
