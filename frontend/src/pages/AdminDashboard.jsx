
import { useState, useEffect } from 'react';
import api from '../api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 0, doctors: 0, appointments: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real app, these would be specific admin endpoints
                // For now, we'll try to fetch doctors to verify admin access
                const doctorsRes = await api.get('/doctors');
                // We might need a generic /users endpoint for admin
                // const usersRes = await api.get('/users'); 

                setStats({
                    users: 0, // Placeholder
                    doctors: doctorsRes.data.length,
                    appointments: 0 // Placeholder
                });
            } catch (error) {
                console.error('Error fetching admin data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-4">Cargando panel de administración...</div>;

    return (
        <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Panel de Administración</h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Médicos</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.doctors}</dd>
                    </div>
                </div>
                {/* Add more stats here */}
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Gestión de Usuarios</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Lista completa de usuarios registrados.</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <p className="text-gray-500">Funcionalidad en desarrollo...</p>
                </div>
            </div>
        </div>
    );
}
