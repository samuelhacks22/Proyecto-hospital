# Proyecto Hospital

Instrucciones para configurar y correr el proyecto después de clonar el repositorio.

## Estructura del Proyecto

El proyecto es un monorepo que contiene:

- `backend/`: Servidor Node.js con Express.
- `frontend/`: Cliente React con Vite.

## Pasos para iniciar (Setup)

Sigue estos pasos en orden desde la terminal en la carpeta raíz del proyecto:

### 1. Instalar dependencias

Primero instala las dependencias de la raíz (para `concurrently`) y luego las de cada carpeta.

```bash
# En la raíz
npm install

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install

# Regresar a la raíz
cd ..
```

### 2. Configurar Variables de Entorno (Backend)

El backend necesita conexión a la base de datos y otras configuraciones.

```bash
cd backend
# Copia el archivo de ejemplo
cp .env.example .env
```

Abre el archivo `.env` creado en la carpeta `backend` y configura:

- `DATABASE_URL`: Tu conexión a PostgreSQL (ej. NeonDB o local).
- Otros valores según sea necesario.

### 3. Ejecutar el Proyecto

Desde la carpeta **raíz**, ejecuta:

```bash
npm run dev
```

Este comando iniciará simultáneamente:

- El servidor Backend (Backend running on port 3001)
- El servidor Frontend (Vite)

¡Listo! Abre la URL que te muestre Vite (generalmente http://localhost:5173).
