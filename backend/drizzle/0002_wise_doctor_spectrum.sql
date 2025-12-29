CREATE TYPE "public"."rol" AS ENUM('PACIENTE', 'MEDICO', 'CLINICA', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."estado_cita" AS ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA');--> statement-breakpoint
CREATE TYPE "public"."tipo_cita" AS ENUM('VIRTUAL', 'PRESENCIAL');--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"contrasena" text NOT NULL,
	"nombre_completo" text,
	"telefono" text,
	"cedula" text,
	"foto_url" text,
	"rol" "rol" DEFAULT 'PACIENTE',
	"creado_en" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "medicos" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" varchar NOT NULL,
	"especialidad" text NOT NULL,
	"numero_licencia" text,
	"biografia" text,
	"precio_consulta" integer,
	"verificado" boolean DEFAULT false,
	CONSTRAINT "medicos_usuario_id_unique" UNIQUE("usuario_id")
);
--> statement-breakpoint
CREATE TABLE "disponibilidad" (
	"id" serial PRIMARY KEY NOT NULL,
	"medico_id" integer NOT NULL,
	"dia_semana" integer NOT NULL,
	"hora_inicio" time NOT NULL,
	"hora_fin" time NOT NULL
);
--> statement-breakpoint
CREATE TABLE "citas" (
	"id" serial PRIMARY KEY NOT NULL,
	"paciente_id" varchar NOT NULL,
	"medico_id" integer NOT NULL,
	"fecha" date NOT NULL,
	"hora_inicio" time NOT NULL,
	"estado" "estado_cita" DEFAULT 'PENDIENTE' NOT NULL,
	"tipo" "tipo_cita" DEFAULT 'VIRTUAL' NOT NULL,
	"enlace_reunion" text,
	"notas" text,
	"creado_en" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
DROP TABLE "doctors" CASCADE;--> statement-breakpoint
DROP TABLE "availability" CASCADE;--> statement-breakpoint
DROP TABLE "appointments" CASCADE;--> statement-breakpoint
ALTER TABLE "medicos" ADD CONSTRAINT "medicos_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disponibilidad" ADD CONSTRAINT "disponibilidad_medico_id_medicos_id_fk" FOREIGN KEY ("medico_id") REFERENCES "public"."medicos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citas" ADD CONSTRAINT "citas_paciente_id_usuarios_id_fk" FOREIGN KEY ("paciente_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citas" ADD CONSTRAINT "citas_medico_id_medicos_id_fk" FOREIGN KEY ("medico_id") REFERENCES "public"."medicos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
DROP TYPE "public"."role";--> statement-breakpoint
DROP TYPE "public"."appointment_status";--> statement-breakpoint
DROP TYPE "public"."appointment_type";