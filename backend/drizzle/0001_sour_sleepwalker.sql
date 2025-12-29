ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'PACIENTE'::text;--> statement-breakpoint
UPDATE "users" SET "role" = 'PACIENTE' WHERE "role" = 'PATIENT';--> statement-breakpoint
UPDATE "users" SET "role" = 'MEDICO' WHERE "role" = 'DOCTOR';--> statement-breakpoint
DROP TYPE "public"."role";--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('PACIENTE', 'MEDICO', 'CLINICA', 'ADMIN');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'PACIENTE'::"public"."role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."role" USING "role"::"public"."role";--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'PENDIENTE'::text;--> statement-breakpoint
DROP TYPE "public"."appointment_status";--> statement-breakpoint
CREATE TYPE "public"."appointment_status" AS ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA');--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'PENDIENTE'::"public"."appointment_status";--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "status" SET DATA TYPE "public"."appointment_status" USING "status"::"public"."appointment_status";--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "type" SET DEFAULT 'VIRTUAL'::text;--> statement-breakpoint
DROP TYPE "public"."appointment_type";--> statement-breakpoint
CREATE TYPE "public"."appointment_type" AS ENUM('VIRTUAL', 'PRESENCIAL');--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "type" SET DEFAULT 'VIRTUAL'::"public"."appointment_type";--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "type" SET DATA TYPE "public"."appointment_type" USING "type"::"public"."appointment_type";