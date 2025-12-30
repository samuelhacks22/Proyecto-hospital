const { pgTable, serial, text, timestamp, boolean, pgEnum, integer, date, time, varchar } = require("drizzle-orm/pg-core");

// Enums (Spanish) - Already done
const roleEnum = pgEnum("rol", ["PACIENTE", "MEDICO", "CLINICA", "ADMIN"]);
const appointmentStatusEnum = pgEnum("estado_cita", ["PENDIENTE", "CONFIRMADA", "CANCELADA", "COMPLETADA"]);
const appointmentTypeEnum = pgEnum("tipo_cita", ["VIRTUAL", "PRESENCIAL"]);

// Clinicas (Tenants)
const clinicas = pgTable("clinicas", {
    id: serial("id").primaryKey(),
    nombre: text("nombre").notNull(),
    direccion: text("direccion"),
    telefono: text("telefono"),
    logoUrl: text("logo_url"),
    adminUsuarioId: varchar("admin_usuario_id").references(() => usuarios.id),
    creadoEn: timestamp("creado_en").defaultNow(),
});

// Usuarios (Updated with clinicaId)
const usuarios = pgTable("usuarios", {
    id: varchar("id").primaryKey().notNull(), // UUID
    email: text("email").notNull(),
    contrasena: text("contrasena").notNull(), // password_hash
    nombreCompleto: text("nombre_completo"), // full_name
    telefono: text("telefono"),
    cedula: text("cedula"),
    fotoUrl: text("foto_url"),
    rol: roleEnum("rol").default("PACIENTE"),
    clinicaId: integer("clinica_id").references(() => clinicas.id), // Tenant FK
    creadoEn: timestamp("creado_en").defaultNow(),
});

// Medicos
const medicos = pgTable("medicos", {
    id: serial("id").primaryKey(),
    usuarioId: varchar("usuario_id").references(() => usuarios.id).notNull().unique(),
    especialidad: text("especialidad").notNull(),
    numeroLicencia: text("numero_licencia"),
    biografia: text("biografia"),
    precioConsulta: integer("precio_consulta"),
    verificado: boolean("verificado").default(false),
    clinicaId: integer("clinica_id").references(() => clinicas.id), // Tenant FK
});

// Disponibilidad
const disponibilidad = pgTable("disponibilidad", {
    id: serial("id").primaryKey(),
    medicoId: integer("medico_id").references(() => medicos.id).notNull(),
    diaSemana: integer("dia_semana").notNull(), // 0-6
    horaInicio: time("hora_inicio").notNull(),
    horaFin: time("hora_fin").notNull(),
});

// Citas
const citas = pgTable("citas", {
    id: serial("id").primaryKey(),
    pacienteId: varchar("paciente_id").references(() => usuarios.id).notNull(),
    medicoId: integer("medico_id").references(() => medicos.id).notNull(),
    fecha: date("fecha").notNull(),
    horaInicio: time("hora_inicio").notNull(),
    estado: appointmentStatusEnum("estado").default("PENDIENTE").notNull(),
    tipo: appointmentTypeEnum("tipo").default("VIRTUAL").notNull(),
    enlaceReunion: text("enlace_reunion"),
    notas: text("notas"),
    clinicaId: integer("clinica_id").references(() => clinicas.id), // Tenant FK
    creadoEn: timestamp("creado_en").defaultNow(),
});

// Resultados de Laboratorio
const resultadosLaboratorio = pgTable("resultados_laboratorio", {
    id: serial("id").primaryKey(),
    pacienteId: varchar("paciente_id").references(() => usuarios.id).notNull(),
    medicoId: integer("medico_id").references(() => medicos.id), // Opccional, si un médico lo solicitó
    citaId: integer("cita_id").references(() => citas.id), // Opcional, vinculado a una cita
    nombreArchivo: text("nombre_archivo").notNull(),
    urlArchivo: text("url_archivo").notNull(),
    tipo: text("tipo").notNull(), // PDF, IMAGEN, ETC
    descripcion: text("descripcion"),
    subidoEn: timestamp("subido_en").defaultNow(),
    clinicaId: integer("clinica_id").references(() => clinicas.id), // Tenant FK
});

module.exports = {
    roleEnum,
    appointmentStatusEnum,
    appointmentTypeEnum,
    usuarios,
    medicos,
    disponibilidad,
    citas,
    resultadosLaboratorio,
    clinicas,
};
