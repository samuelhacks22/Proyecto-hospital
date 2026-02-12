#!/bin/sh

# Wait for the database to be ready
echo "Waiting for database..."
while ! nc -z db 5432; do
  sleep 1
done
echo "Database is ready!"

# Run migrations (using drizzle-kit push for simplicity in this setup)
echo "Running migrations..."
npm run db:push

# Start the application
echo "Starting application..."
exec npm start
