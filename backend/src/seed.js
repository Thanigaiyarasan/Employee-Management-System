import "dotenv/config";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import Employee from "./models/Employee.js";

const sampleEmployees = [
  {
    name: "Alex Morgan",
    email: "alex@ems.local",
    jobTitle: "Product Designer",
    department: "Design",
    phone: "555-0101"
  },
  {
    name: "Jordan Lee",
    email: "jordan@ems.local",
    jobTitle: "Software Engineer",
    department: "Engineering",
    phone: "555-0102"
  },
  {
    name: "Taylor Brooks",
    email: "taylor@ems.local",
    jobTitle: "People Operations Specialist",
    department: "People",
    phone: "555-0103"
  }
];

try {
  await connectDB();

  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "admin@ems.local").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin123!";
  if (adminPassword.length < 8) throw new Error("SEED_ADMIN_PASSWORD must be at least 8 characters.");

  const existingAdmin = await Employee.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await Employee.create({
      name: "System Admin",
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 12),
      role: "admin",
      jobTitle: "Administrator",
      department: "Administration",
      phone: ""
    });
    console.log(`Created admin account: ${adminEmail}`);
  } else {
    if (existingAdmin.role !== "admin") {
      throw new Error(`The seed admin email belongs to a non-admin account: ${adminEmail}`);
    }
    console.log(`Admin account already exists: ${adminEmail}`);
  }

  const samplePassword = await bcrypt.hash("Employee123!", 12);
  for (const employee of sampleEmployees) {
    await Employee.updateOne(
      { email: employee.email },
      { $setOnInsert: { ...employee, password: samplePassword, role: "employee" } },
      { upsert: true }
    );
  }
  console.log("Sample employee accounts are ready (password: Employee123!).");
  process.exit(0);
} catch (error) {
  console.error("Unable to seed database:", error.message);
  process.exit(1);
}
