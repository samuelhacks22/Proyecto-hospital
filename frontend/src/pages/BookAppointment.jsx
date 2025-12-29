
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService, appointmentService } from '../api';

export default function BookAppointment() {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [notes, setNotes] = useState('');

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
        setAvailability([]); // Clear previous
        try {
            const res = await doctorService.getAvailability(doctor.id);
            setAvailability(res.data);
        } catch (error) {
            console.error('Error fetching availability:', error);
        }
    };

    const handleBook = async (slot, date) => {
        if (!window.confirm(`¿Confirmar cita con Dr. ${selectedDoctor.nombreCompleto} el ${date} a las ${slot.horaInicio}?`)) return;

        setBooking(true);
        try {
            await appointmentService.create({
                medicoId: selectedDoctor.id,
                fecha: date,
                horaInicio: slot.horaInicio,
                tipo: 'VIRTUAL', // Default for now
                notas: notes
            });
            alert('Cita reservada con éxito');
            navigate('/dashboard');
        } catch (error) {
            console.error('Booking error:', error);
            alert('Error al reservar la cita: ' + (error.response?.data?.message || 'Error desconocido'));
        } finally {
            setBooking(false);
        }
    };

    // Helper to generate next few dates based on dayOfWeek
    const getNextDates = (dayOfWeek) => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 4; i++) { // Next 4 weeks
            const d = new Date();
            d.setDate(today.getDate() + (dayOfWeek + 7 - today.getDay()) % 7 + (i * 7));
            // If today is the day, make sure it's not in the past? Simplified for now.
            if (d < today) d.setDate(d.getDate() + 7);

            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    };

    return (
        <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Reservar Cita</h1>

            {/* Step 1: Select Doctor */}
            {!selectedDoctor && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? <p>Cargando médicos...</p> : doctors.map(doctor => (
                        <div key={doctor.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition cursor-pointer border border-transparent hover:border-indigo-500" onClick={() => handleSelectDoctor(doctor)}>
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">{doctor.nombreCompleto}</h3>
                                <p className="mt-1 text-sm text-gray-500">{doctor.especialidad}</p>
                                <p className="mt-2 text-sm text-gray-700">{doctor.biografia || 'Sin biografía'}</p>
                                <p className="mt-4 text-sm font-bold text-indigo-600">Consulta: ${doctor.precioConsulta}</p>
                            </div>
                        </div>
                    ))}
                    {doctors.length === 0 && !loading && <p>No hay médicos disponibles.</p>}
                </div>
            )}

            {/* Step 2: View Availability */}
            {selectedDoctor && (
                <div>
                    <button onClick={() => setSelectedDoctor(null)} className="mb-4 text-sm text-indigo-600 hover:text-indigo-800">← Volver a lista de médicos</button>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Dr. {selectedDoctor.nombreCompleto}</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">{selectedDoctor.especialidad}</p>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                            <h4 className="text-md font-medium text-gray-900 mb-4">Horarios Disponibles (Próximas 4 semanas)</h4>

                            {availability.length === 0 ? (
                                <p className="text-gray-500">Este médico no tiene horarios configurados.</p>
                            ) : (
                                <div className="space-y-6">
                                    {availability.map(slot => (
                                        <div key={slot.id}>
                                            <h5 className="font-medium text-gray-700 mb-2">
                                                {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][slot.diaSemana]}s
                                                <span className="text-sm font-normal text-gray-500 ml-2">({slot.horaInicio} - {slot.horaFin})</span>
                                            </h5>
                                            <div className="flex flex-wrap gap-2">
                                                {getNextDates(slot.diaSemana).map(date => (
                                                    <button
                                                        key={`${slot.id}-${date}`}
                                                        onClick={() => handleBook(slot, date)}
                                                        disabled={booking}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                                                    >
                                                        {date}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700">Notas para el médico (Opcional)</label>
                                <textarea
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Motivo de la consulta..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
