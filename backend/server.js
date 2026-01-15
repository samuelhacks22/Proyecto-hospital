require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');
const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');

const app = express();
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("call-user", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("call-user", { signal: signalData, from, name });
  });

  socket.on("answer-call", (data) => {
    io.to(data.to).emit("call-accepted", data.signal);
  });

  socket.on("ice-candidate", ({ candidate, to }) => {
    io.to(to).emit("ice-candidate", candidate);
  });
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

// Export db for controllers
module.exports = { db };

// Routes imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const labRoutes = require('./routes/labRoutes');
const path = require('path');

// Mount Routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/lab', labRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/health', async (req, res) => {
  try {
    const result = await db.execute('SELECT 1');
    res.json({ status: 'ok', db: 'connected', time: new Date().toISOString() });
  } catch (error) {
    console.error('DB Error:', error);
    res.json({ status: 'error', db: 'disconnected' });
  }
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, db };
