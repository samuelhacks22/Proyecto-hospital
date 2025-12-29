
import { useState, useEffect } from 'react';
import { userService } from '../api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 0, doctors: 0, appointments: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const usersRes = await userService.getAll();
            setUsers(usersRes.data);

            const doctorsCount = usersRes.data.filter(u => u.rol === 'MEDICO').length;

            setStats({
                users: usersRes.data.length,
                doctors: doctorsCount,
                appointments: 0 // We'd need an appointment count endpoint for this
            });
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteUser = async (userId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
            try {
                await userService.delete(userId);
                // Refresh data
                fetchData();
                alert('Usuario eliminado correctamente.');
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Error al eliminar usuario.');
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">Panel de Administración</h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200">
                    <div className="px-6 py-5">
                        <dt className="text-sm font-medium text-slate-500 truncate">Total Usuarios</dt>
                        <dd className="mt-2 text-3xl font-bold text-slate-900">{stats.users}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200">
                    <div className="px-6 py-5">
                        <dt className="text-sm font-medium text-slate-500 truncate">Total Médicos</dt>
                        <dd className="mt-2 text-3xl font-bold text-slate-900">{stats.doctors}</dd>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-semibold text-slate-900">Gestión de Usuarios</h3>
                        <p className="mt-1 max-w-2xl text-sm text-slate-500">Lista completa de usuarios registrados en la plataforma.</p>
                    </div>
                    <button onClick={fetchData} className="text-brand-600 hover:text-brand-700 text-sm font-medium">Actualizar</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Usuario</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rol</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contacto</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                                    {user.nombreCompleto?.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-slate-900">{user.nombreCompleto}</div>
                                                <div className="text-sm text-slate-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.rol === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                                user.rol === 'MEDICO' ? 'bg-blue-100 text-blue-800' :
                                                    user.rol === 'CLINICA' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-green-100 text-green-800'
                                            }`}>
                                            {user.rol}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {user.telefono || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {user.rol !== 'ADMIN' && (
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
