
import { useState, useEffect } from 'react';
import { userService } from '../api';

export default function Profile() {
    const [profile, setProfile] = useState({
        nombreCompleto: '',
        email: '',
        telefono: '',
        cedula: '',
        rol: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await userService.getProfile();
                setProfile(res.data);
            } catch (error) {
                console.error('Error fetching profile', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await userService.updateProfile(profile);
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
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Mi Perfil</h1>

            <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="h-24 w-24 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-3xl font-bold border-4 border-white shadow-sm">
                            {profile.nombreCompleto?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Rol asignado</p>
                            <span className="inline-flex items-center px-3 py-1 mt-1 rounded-full text-sm font-medium bg-brand-50 text-brand-700 border border-brand-100">
                                {profile.rol}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-sm font-medium text-slate-700">Nombre Completo</label>
                            <input
                                type="text"
                                name="nombreCompleto"
                                value={profile.nombreCompleto}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-sm font-medium text-slate-700">Correo Electrónico</label>
                            <input
                                type="text"
                                value={profile.email}
                                disabled
                                className="mt-1 block w-full rounded-lg border-slate-200 bg-slate-50 shadow-sm text-slate-500 sm:text-sm"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-sm font-medium text-slate-700">Teléfono</label>
                            <input
                                type="text"
                                name="telefono"
                                value={profile.telefono || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                            />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-sm font-medium text-slate-700">Cédula / ID</label>
                            <input
                                type="text"
                                name="cedula"
                                value={profile.cedula || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`inline-flex justify-center rounded-lg border border-transparent py-2.5 px-6 text-sm font-bold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${saving ? 'bg-brand-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 hover:-translate-y-0.5'
                                }`}
                        >
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
