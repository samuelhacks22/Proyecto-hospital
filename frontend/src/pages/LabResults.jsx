
import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function LabResults() {
    const { user } = useAuth();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Upload Form State
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState(''); // For doctors
    const [patients, setPatients] = useState([]); // For doctors to select

    useEffect(() => {
        fetchResults();
        if (user.rol === 'MEDICO') {
            // Fetch patients for dropdown (Mocking or using existing endpoint if available)
            // For now we might just input ID manually or skip if no endpoint
        }
    }, []);

    const fetchResults = async () => {
        try {
            const res = await api.get('/lab');
            setResults(res.data);
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('archivo', file);
        formData.append('descripcion', description);
        formData.append('tipo', file.type.includes('pdf') ? 'PDF' : 'IMAGEN');

        // If doctor, they must specify patient ID (Manual for now for MVP level 2)
        // If patient, backend takes their ID automatically
        if (user.rol === 'MEDICO') {
            if (!selectedPatientId) return alert('Debe ingresar el ID del paciente');
            formData.append('pacienteId', selectedPatientId);
        } else {
            formData.append('pacienteId', user.id);
        }

        setUploading(true);
        try {
            await api.post('/lab/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Archivo subido correctamente');
            setFile(null);
            setDescription('');
            fetchResults();
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error al subir archivo');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="p-4 text-center">Cargando resultados...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-slate-900">Resultados de Laboratorio & Exámenes</h1>

            {/* Upload Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold mb-4">Subir Nuevo Resultado</h3>
                <form onSubmit={handleUpload} className="space-y-4">
                    {user.rol === 'MEDICO' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700">ID del Paciente</label>
                            <input
                                type="text"
                                value={selectedPatientId}
                                onChange={(e) => setSelectedPatientId(e.target.value)}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                placeholder="UUID del paciente (Temporal: copiar de Admin)"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Descripción</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                            placeholder="Ej: Análisis de Sangre - Enero"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Archivo (PDF o Imagen)</label>
                        <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-brand-50 file:text-brand-700
                                hover:file:bg-brand-100"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={uploading || !file}
                            className={`px-4 py-2 rounded-lg text-white font-bold transition-all ${uploading || !file ? 'bg-slate-300 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'
                                }`}
                        >
                            {uploading ? 'Subiendo...' : 'Subir Archivo'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Results List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.length === 0 && <p className="text-slate-500 col-span-2 text-center">No hay resultados disponibles.</p>}

                {results.map(res => (
                    <div key={res.id} className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs uppercase">
                                {res.tipo}
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900">{res.descripcion || res.nombreArchivo}</p>
                                <p className="text-xs text-slate-500">{new Date(res.subidoEn).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <a
                            href={`http://localhost:3001${res.urlArchivo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-600 hover:text-brand-800 text-sm font-medium"
                        >
                            Ver / Descargar
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
