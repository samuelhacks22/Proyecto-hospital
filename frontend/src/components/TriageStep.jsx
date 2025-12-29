
import { useState } from 'react';

export default function TriageStep({ onComplete }) {
    const [step, setStep] = useState(0);

    const handleAnswer = (answer, type) => {
        if (type === 'EMERGENCY') {
            setStep(99); // Emergency state
        } else if (type === 'PHYSICAL') {
            onComplete('PRESENCIAL');
        } else if (type === 'VIRTUAL') {
            onComplete('VIRTUAL');
        } else {
            // Next question
            setStep(step + 1);
        }
    };

    if (step === 99) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center animate-pulse">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                    <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-red-800 mb-2">¡Atención! Podría ser una emergencia</h3>
                <p className="text-red-700 mb-6">Basado en sus síntomas, le recomendamos acudir inmediatamente a un servicio de urgencias o llamar al número de emergencias local.</p>
                <div className="flex justify-center gap-4">
                    <button onClick={() => window.location.href = '/dashboard'} className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-50">
                        Volver al inicio
                    </button>
                    <button onClick={() => setStep(0)} className="px-4 py-2 text-red-600 hover:underline">
                        Reiniciar cuestionario
                    </button>
                </div>
            </div>
        );
    }

    const questions = [
        {
            text: "¿Su consulta es por alguno de estos motivos?",
            subtext: "Dificultad para respirar severa, dolor de pecho intenso, pérdida de conciencia, sangrado profuso.",
            options: [
                { label: "Sí, tengo estos síntomas", type: 'EMERGENCY' },
                { label: "No, es otra cosa", type: 'NEXT' }
            ]
        },
        {
            text: "¿Qué tipo de atención necesita?",
            subtext: "Seleccione la opción que mejor describa su necesidad actual.",
            options: [
                { label: "Revisión de exámenes / Lectura de resultados", type: 'VIRTUAL' },
                { label: "Consulta de seguimiento / Rutina", type: 'VIRTUAL' },
                { label: "Malestar físico que requiere examen (dolor abdominal, lesiones, etc.)", type: 'PHYSICAL' }
            ]
        }
    ];

    const currentQ = questions[step];

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden max-w-2xl mx-auto">
            <div className="bg-brand-600 p-6 text-white text-center">
                <h2 className="text-xl font-bold">Evaluación Inicial (Triage)</h2>
                <p className="text-brand-100 text-sm mt-1">Ayúdenos a dirigirlo al servicio correcto</p>
            </div>
            <div className="p-8">
                <div className="mb-8 text-center">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{currentQ.text}</h3>
                    <p className="text-slate-500">{currentQ.subtext}</p>
                </div>

                <div className="space-y-3">
                    {currentQ.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(opt, opt.type)}
                            className="w-full p-4 text-left border rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-all group flex justify-between items-center"
                        >
                            <span className="font-medium text-slate-700 group-hover:text-brand-700">{opt.label}</span>
                            <svg className="w-5 h-5 text-slate-300 group-hover:text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    ))}
                </div>
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between text-xs text-slate-400">
                <span>Paso {step + 1} de {questions.length}</span>
                <span>MediFlow Smart Triage</span>
            </div>
        </div>
    );
}
