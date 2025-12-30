
-- Create Clinicas table
CREATE TABLE IF NOT EXISTS "clinicas" (
    "id" serial PRIMARY KEY,
    "nombre" text NOT NULL,
    "direccion" text,
    "telefono" text,
    "logo_url" text,
    "admin_usuario_id" varchar references "usuarios"("id"),
    "creado_en" timestamp DEFAULT now()
);

-- Add clinica_id to Usuarios (Circular reference handled by DB usually fine, valid FK)
ALTER TABLE "usuarios" ADD COLUMN "clinica_id" integer REFERENCES "clinicas"("id");

-- Add clinica_id to Medicos
ALTER TABLE "medicos" ADD COLUMN "clinica_id" integer REFERENCES "clinicas"("id");

-- Add clinica_id to Citas
ALTER TABLE "citas" ADD COLUMN "clinica_id" integer REFERENCES "clinicas"("id");

-- Add clinica_id to Resultados
ALTER TABLE "resultados_laboratorio" ADD COLUMN "clinica_id" integer REFERENCES "clinicas"("id");
