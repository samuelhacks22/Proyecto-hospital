
import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Navbar */}
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <div className="text-2xl font-bold text-brand-600 tracking-tighter">
                    MediFlow
                </div>
                <div className="flex space-x-4">
                    <Link to="/login" className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
                        Iniciar Sesión
                    </Link>
                    <Link to="/register" className="px-5 py-2 text-sm font-bold text-white bg-brand-600 rounded-full hover:bg-brand-700 shadow-md shadow-brand-200 transition-all hover:-translate-y-0.5">
                        Registrarse
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative overflow-hidden pt-16 pb-32 space-y-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wide mb-6">
                        Nuevo Ecosistema de Salud
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
                        Tu Salud, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-500">Sin Barreras</span>.
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-12 leading-relaxed">
                        MediFlow elimina la burocracia médica. Gestiona citas, revisa resultados y conecta con especialistas desde la comodidad de tu hogar.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/register" className="px-8 py-4 text-lg font-bold text-white bg-brand-600 rounded-xl shadow-xl shadow-brand-500/30 hover:bg-brand-700 transition-all transform hover:-translate-y-1">
                            Comenzar Ahora
                        </Link>
                        <Link to="/login" className="px-8 py-4 text-lg font-bold text-slate-700 bg-white border-2 border-slate-100 rounded-xl hover:border-brand-200 hover:text-brand-600 transition-all">
                            Soy Médico
                        </Link>
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -ml-[40rem] w-[80rem] h-[80rem] rounded-full bg-brand-50/50 blur-3xl -z-10 opacity-60"></div>
                <div className="absolute top-40 right-0 w-[40rem] h-[40rem] rounded-full bg-accent-50/50 blur-3xl -z-10 opacity-60"></div>
            </div>

            {/* Features / Levels Section */}
            <div className="bg-slate-50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">El Embudo Inteligente</h2>
                        <p className="text-lg text-slate-500">
                            Optimizamos tu tiempo y el de tu médico con un sistema de 3 niveles diseñado para resolver problemas, no crearlos.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Level 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                            <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 font-bold text-2xl">
                                1
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Triage Digital</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Evita traslados innecesarios. Comienza con una evaluación rápida para saber si necesitas una cita virtual o presencial.
                            </p>
                        </div>
                        {/* Level 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                Nuevo
                            </div>
                            <div className="h-14 w-14 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Integración de Resultados</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Sube y visualiza tus exámenes de laboratorio directamente en la plataforma. Tu médico los revisa antes de verte.
                            </p>
                        </div>
                        {/* Level 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                            <div className="h-14 w-14 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Visita Optimizada</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Cuando la cita presencial es necesaria, llegas con el historial y resultados listos. Menos charla, más diagnóstico.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-slate-900 py-24 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                        ¿Listo para modernizar tu experiencia médica?
                    </h2>
                    <Link to="/register" className="inline-block px-8 py-4 text-lg font-bold text-brand-900 bg-brand-400 rounded-xl hover:bg-brand-300 transition-colors shadow-lg shadow-brand-500/20">
                        Crear Cuenta Gratis
                    </Link>
                    <p className="mt-8 text-slate-400 text-sm">
                        Para clínicas y médicos: <a href="#" className="underline hover:text-white">Contáctanos para demo empresarial</a>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-50 py-12 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
                    <p>&copy; 2024 MediFlow. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
