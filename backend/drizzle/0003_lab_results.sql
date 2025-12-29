
CREATE TABLE IF NOT EXISTS "resultados_laboratorio" (
	"id" serial PRIMARY KEY NOT NULL,
	"paciente_id" varchar NOT NULL,
	"medico_id" integer,
	"cita_id" integer,
	"nombre_archivo" text NOT NULL,
	"url_archivo" text NOT NULL,
	"tipo" text NOT NULL,
	"descripcion" text,
	"subido_en" timestamp DEFAULT now()
);

DO $$ BEGIN
 ALTER TABLE "resultados_laboratorio" ADD CONSTRAINT "resultados_laboratorio_paciente_id_usuarios_id_fk" FOREIGN KEY ("paciente_id") REFERENCES "usuarios"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "resultados_laboratorio" ADD CONSTRAINT "resultados_laboratorio_medico_id_medicos_id_fk" FOREIGN KEY ("medico_id") REFERENCES "medicos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "resultados_laboratorio" ADD CONSTRAINT "resultados_laboratorio_cita_id_citas_id_fk" FOREIGN KEY ("cita_id") REFERENCES "citas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
