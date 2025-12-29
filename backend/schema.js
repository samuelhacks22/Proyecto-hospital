const { pgTable, serial, text, timestamp } = require("drizzle-orm/pg-core");

// Example user table (placeholder)
const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name"),
    email: text("email").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow(),
});

module.exports = { users };
