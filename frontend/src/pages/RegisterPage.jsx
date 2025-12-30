import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        cedula: '',
        email: '',
        password: '',
        telefono: '',
        rol: 'PACIENTE'
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await register(formData);
        if (result.success) {
            alert('Registro exitoso. Por favor inicia sesión.');
            navigate('/login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-lg rounded-xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Crear Cuenta
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                            <p>{error}</p>
                        </div>
                    )}

                    <input
                        name="nombreCompleto"
                        type="text"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        placeholder="Nombre Completo"
                        value={formData.nombreCompleto}
                        onChange={handleChange}
                    />

                    <input
                        name="cedula"
                        type="text"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        placeholder="Cédula (Ej: 402-1234567-8)"
                        value={formData.cedula}
                        onChange={handleChange}
                    />

                    <input
                        name="email"
                        type="email"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        placeholder="Correo Electrónico"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <input
                        name="telefono"
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        placeholder="Teléfono"
                        value={formData.telefono}
                        onChange={handleChange}
                    />

                    <input
                        name="password"
                        type="password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">Soy:</label>
                        <select
                            name="rol"
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={handleChange}
                            value={formData.rol}
                        >
                            <option value="PACIENTE">Paciente</option>
                            <option value="MEDICO">Médico</option>
                            <option value="CLINICA">Centro Médico / Clínica</option>
                        </select>
                    </div>

                    {formData.rol === 'CLINICA' && (
                        <>
                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Datos de la Clínica</h3>
                                <input
                                    name="nombreClinica"
                                    type="text"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 mb-3"
                                    placeholder="Nombre de la Institución"
                                    value={formData.nombreClinica || ''}
                                    onChange={handleChange}
                                />
                                <input
                                    name="direccionClinica"
                                    type="text"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                    placeholder="Dirección Física"
                                    value={formData.direccionClinica || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Registrarse
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
