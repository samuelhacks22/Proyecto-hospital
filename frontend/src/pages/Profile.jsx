
import { useState, useEffect } from 'react';
import { userService } from '../api';

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        telefono: '',
        cedula: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await userService.getProfile();
                setProfile(res.data);
                setFormData({
                    nombreCompleto: res.data.nombreCompleto || '',
                    telefono: res.data.telefono || '',
                    cedula: res.data.cedula || ''
                });
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await userService.updateProfile(formData);
            setProfile(res.data);
            alert('Perfil actualizado correctamente');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error al actualizar perfil');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-4">Cargando perfil...</div>;

    return (
        <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Mi Perfil</h1>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Información Personal</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Detalles de tu cuenta y contacto.</p>
                </div>
                <div className="border-t border-gray-200">
                    <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-4">
                                <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                                <input
                                    type="text"
                                    name="nombreCompleto"
                                    value={formData.nombreCompleto}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-4">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    disabled
                                    value={profile?.email || ''}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm border p-2 text-gray-500"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                <input
                                    type="text"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">Cédula</label>
                                <input
                                    type="text"
                                    name="cedula"
                                    value={formData.cedula}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-4">
                                <label className="block text-sm font-medium text-gray-700">Rol</label>
                                <input
                                    type="text"
                                    disabled
                                    value={profile?.rol || ''}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm border p-2 text-gray-500"
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                {saving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
