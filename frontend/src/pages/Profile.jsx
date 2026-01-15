import { useState, useEffect } from 'react';
import { userService, doctorService } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        nombreCompleto: '',
        email: '',
        telefono: '',
        cedula: '',
        rol: '',
        // Doctor specific
        especialidad: '',
        numeroLicencia: '',
        biografia: '',
        precioConsulta: ''
    });
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const DAYS = [
        { id: 1, name: 'Lunes' },
        { id: 2, name: 'Martes' },
        { id: 3, name: 'Miércoles' },
        { id: 4, name: 'Jueves' },
        { id: 5, name: 'Viernes' },
        { id: 6, name: 'Sábado' },
        { id: 0, name: 'Domingo' }
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Fetch basic user profile
                const resUser = await userService.getProfile();
                let userData = resUser.data;

                if (user.rol === 'MEDICO') {
                    // Fetch doctor details and availability
                    const [resDoc, resAvail] = await Promise.all([
                        doctorService.getProfile(),
                        doctorService.getMyAvailability()
                    ]);

                    userData = { ...userData, ...resDoc.data };

                    // Map availability to usable format
                    const schedule = resAvail.data.map(slot => ({
                        diaSemana: slot.diaSemana,
                        horaInicio: slot.horaInicio.slice(0, 5),
                        horaFin: slot.horaFin.slice(0, 5)
                    }));
                    setAvailability(schedule);
                }

                setProfile(userData);
            } catch (error) {
                console.error('Error fetching profile', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user.rol]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleScheduleChange = (dayId, field, value) => {
        setAvailability(prev => {
            const existing = prev.find(p => p.diaSemana === dayId);
            if (!existing && !value) return prev; // If removing and didn't exist, ignore

            let newSchedule = [...prev];
            if (existing) {
                // Update existing
                newSchedule = newSchedule.map(item =>
                    item.diaSemana === dayId ? { ...item, [field]: value } : item
                );
            } else {
                // Add new
                newSchedule.push({
                    diaSemana: dayId,
                    horaInicio: field === 'horaInicio' ? value : '09:00',
                    horaFin: field === 'horaFin' ? value : '17:00'
                });
            }

            // Filter out incomplete or empty
            return newSchedule;
        });
    };

    const getDaySchedule = (dayId) => {
        return availability.find(p => p.diaSemana === dayId) || { horaInicio: '', horaFin: '' };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (user.rol === 'MEDICO') {
                await doctorService.updateProfile(profile);

                // Clean availability before sending: remove incomplete entries
                const cleanSchedule = availability.filter(s => s.horaInicio && s.horaFin);
                await doctorService.setAvailability({ schedule: cleanSchedule });
            } else {
                await userService.updateProfile(profile);
            }
            alert('Perfil actualizado correctamente');
        } catch (error) {
            console.error('Error updating profile', error);
            alert('Error al actualizar perfil');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-4 text-center text-slate-500">Cargando perfil...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Mi Perfil {user.rol === 'MEDICO' && '(Doctor)'}</h1>

            <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <section>
                        <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Información Personal</h2>
                        <div className="flex items-center space-x-6 mb-6">
                            <div className="h-20 w-20 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-2xl font-bold border-4 border-white shadow-sm">
                                {profile.nombreCompleto?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-50 text-brand-700 border border-brand-100">
                                    {profile.rol}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Nombre Completo</label>
                                <input type="text" name="nombreCompleto" value={profile.nombreCompleto || ''} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Email</label>
                                <input type="text" value={profile.email || ''} disabled className="mt-1 block w-full rounded-lg border-slate-200 bg-slate-50 text-slate-500 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Teléfono</label>
                                <input type="text" name="telefono" value={profile.telefono || ''} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Cédula</label>
                                <input type="text" name="cedula" value={profile.cedula || ''} disabled className="mt-1 block w-full rounded-lg border-slate-200 bg-slate-50 text-slate-500 sm:text-sm" />
                            </div>
                        </div>
                    </section>

                    {/* Doctor Specifics */}
                    {user.rol === 'MEDICO' && (
                        <>
                            <section>
                                <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Información Profesional</h2>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700">Especialidad</label>
                                        <input type="text" name="especialidad" value={profile.especialidad || ''} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700">Licencia Médica</label>
                                        <input type="text" name="numeroLicencia" value={profile.numeroLicencia || ''} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700">Precio Consulta (DOP)</label>
                                        <input type="number" name="precioConsulta" value={profile.precioConsulta || ''} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700">Biografía</label>
                                        <textarea name="biografia" rows={3} value={profile.biografia || ''} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm" />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Horario de Disponibilidad</h2>
                                <p className="text-sm text-slate-500 mb-4">Define tu horario de atención. Deja en blanco los días que no trabajas.</p>
                                <div className="space-y-3">
                                    {DAYS.map(day => {
                                        const schedule = getDaySchedule(day.id);
                                        return (
                                            <div key={day.id} className="flex items-center gap-4">
                                                <div className="w-24 text-sm font-medium text-slate-700">{day.name}</div>
                                                <input
                                                    type="time"
                                                    value={schedule.horaInicio}
                                                    onChange={(e) => handleScheduleChange(day.id, 'horaInicio', e.target.value)}
                                                    className="rounded border-slate-300 text-sm focus:ring-brand-500 focus:border-brand-500"
                                                />
                                                <span className="text-slate-400">-</span>
                                                <input
                                                    type="time"
                                                    value={schedule.horaFin}
                                                    onChange={(e) => handleScheduleChange(day.id, 'horaFin', e.target.value)}
                                                    className="rounded border-slate-300 text-sm focus:ring-brand-500 focus:border-brand-500"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        </>
                    )}

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`inline-flex justify-center rounded-lg border border-transparent py-2.5 px-6 text-sm font-bold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${saving ? 'bg-brand-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 hover:-translate-y-0.5'}`}
                        >
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
