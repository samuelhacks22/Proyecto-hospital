const { pgTable, serial, text, timestamp, boolean, pgEnum, integer, date, time } = require("drizzle-orm/pg-core");

// Enums
const roleEnum = pgEnum("role", ["PATIENT", "DOCTOR", "CLINIC", "ADMIN"]);
const appointmentStatusEnum = pgEnum("appointment_status", ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]);
const appointmentTypeEnum = pgEnum("appointment_type", ["VIRTUAL", "IN_PERSON"]);

// Users (Base Table)
const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    fullName: text("full_name").notNull(),
    phone: text("phone"),
    cedula: text("cedula"), // Optional for now
    role: roleEnum("role").default("PATIENT").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Doctors (Profile)
const doctors = pgTable("doctors", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull().unique(),
    specialty: text("specialty").notNull(),
    licenseNumber: text("license_number"),
    bio: text("bio"),
    consultationFee: integer("consultation_fee"), // Store in cents or small unit
    isVerified: boolean("is_verified").default(false),
});

// Availability (Doctor's Schedule)
const availability = pgTable("availability", {
    id: serial("id").primaryKey(),
    doctorId: integer("doctor_id").references(() => doctors.id).notNull(),
    dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sun-Sat)
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
});

// Appointments
const appointments = pgTable("appointments", {
    id: serial("id").primaryKey(),
    patientId: integer("patient_id").references(() => users.id).notNull(),
    doctorId: integer("doctor_id").references(() => doctors.id).notNull(),
    date: date("date").notNull(),
    startTime: time("start_time").notNull(),
    status: appointmentStatusEnum("status").default("PENDING").notNull(),
    type: appointmentTypeEnum("type").default("VIRTUAL").notNull(),
    meetingLink: text("meeting_link"), // For virtual consultations
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
});

module.exports = {
    roleEnum,
    appointmentStatusEnum,
    appointmentTypeEnum,
    users,
    doctors,
    availability,
    appointments,
};
