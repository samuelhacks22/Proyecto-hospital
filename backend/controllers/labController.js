
const { eq, desc } = require('drizzle-orm');
const { db } = require('../server');
const { resultadosLaboratorio, usuarios, medicos } = require('../schema');
const fs = require('fs');
const path = require('path');

// Upload Result
exports.uploadResult = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ningún archivo' });
        }

        const { pacienteId, descripcion, tipo } = req.body;

        // For local storage, we construct a URL relative to the server
        const urlArchivo = `/uploads/${req.file.filename}`;

        // Get medicoId if the uploader is a doctor
        let medicoId = null;
        if (req.user.rol === 'MEDICO') {
            const medico = await db.select().from(medicos).where(eq(medicos.usuarioId, req.user.id));
            if (medico.length > 0) medicoId = medico[0].id;
        }

        const result = await db.insert(resultadosLaboratorio).values({
            pacienteId,
            medicoId, // Optional
            nombreArchivo: req.file.originalname,
            urlArchivo,
            tipo: tipo || 'ARCHIVO',
            descripcion,
        }).returning();

        res.status(201).json(result[0]);
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Error al subir el archivo' });
    }
};

// Get Results (for Patient or Doctor)
exports.getResults = async (req, res) => {
    try {
        let results;

        // Patient sees their own results
        if (req.user.rol === 'PACIENTE') {
            results = await db.select()
                .from(resultadosLaboratorio)
                .where(eq(resultadosLaboratorio.pacienteId, req.user.id))
                .orderBy(desc(resultadosLaboratorio.subidoEn));
        }
        // Doctors see results they uploaded OR all results (depending on privacy rules)
        // For MediFlow Level 2, let's allow doctors to see results for simplicity or specific patient queries
        else if (req.user.rol === 'MEDICO') {
            // Ideally we filter by patientId passed in query
            const { patientId } = req.query;
            if (patientId) {
                results = await db.select()
                    .from(resultadosLaboratorio)
                    .where(eq(resultadosLaboratorio.pacienteId, patientId))
                    .orderBy(desc(resultadosLaboratorio.subidoEn));
            } else {
                // Or see what they uploaded
                // This is a simplification. Real app needs strict access control.
                const medico = await db.select().from(medicos).where(eq(medicos.usuarioId, req.user.id));
                if (medico.length > 0) {
                    results = await db.select()
                        .from(resultadosLaboratorio)
                        .where(eq(resultadosLaboratorio.medicoId, medico[0].id))
                        .orderBy(desc(resultadosLaboratorio.subidoEn));
                } else {
                    results = [];
                }
            }
        } else {
            return res.status(403).json({ message: 'Acceso denegado' });
        }

        res.json(results);
    } catch (error) {
        console.error('Get Results Error:', error);
        res.status(500).json({ message: 'Error al obtener resultados' });
    }
};
