require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// Routes
app.get('/', (req, res) => {
  res.send('Plataforma Médica API Running');
});

app.get('/health', async (req, res) => {
  try {
    const result = await sql`SELECT 1`;
    res.json({ status: 'ok', db: 'connected', time: new Date().toISOString() });
  } catch (error) {
    console.error('DB Error:', error);
    res.json({ status: 'error', db: 'disconnected' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, db };
