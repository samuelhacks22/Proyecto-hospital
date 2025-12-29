
import { useState, useEffect } from 'react';
import { doctorService } from '../api';

export default function ClinicDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch doctors associated with the clinic (mocking with all doctors for now)
        const fetchDoctors = async () => {
            try {
                const res = await doctorService.getAll();
                setDoctors(res.data);
            } catch (error) {
                console.error('Error fetching clinic doctors:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    if (loading) return <div className="p-4">Cargando panel de clínica...</div>;

    return (
        <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Panel de Clínica</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Médicos de la Clínica</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Gestione los médicos asociados a esta clínica.</p>
                </div>
                <ul role="list" className="divide-y divide-gray-200">
                    {doctors.map((doctor) => (
                        <li key={doctor.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-indigo-600 truncate">
                                    {doctor.nombreCompleto}
                                </div>
                                <div className="ml-2 flex-shrink-0 flex">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Activo
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                <p>{doctor.especialidad}</p>
                            </div>
                        </li>
                    ))}
                    {doctors.length === 0 && <li className="px-4 py-4 text-gray-500">No hay médicos asociados.</li>}
                </ul>
            </div>
        </div>
    );
}
