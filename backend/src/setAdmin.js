import "dotenv/config";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import Employee from "./models/Employee.js";

const email = String(process.env.EMS_ADMIN_EMAIL || "").trim().toLowerCase();
const password = process.env.EMS_ADMIN_PASSWORD;

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Set EMS_ADMIN_EMAIL to a valid email address.");
  process.exit(1);
}
if (typeof password !== "string" || password.length < 8) {
  console.error("Set EMS_ADMIN_PASSWORD to a password with at least 8 characters.");
  process.exit(1);
}

try {
  await connectDB();

  let admin = await Employee.findOne({ email });
  if (admin?.role !== "admin") {
    const existingAdmin = await Employee.findOne({ role: "admin" }).sort({ createdAt: 1 });
    if (admin && existingAdmin) {
      throw new Error(
        `${email} already belongs to an employee and another admin account exists. Resolve that account conflict before changing roles.`
      );
    }
    admin ||= existingAdmin;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  if (admin) {
    admin.name ||= "System Admin";
    admin.email = email;
    admin.password = hashedPassword;
    admin.role = "admin";
    admin.jobTitle ||= "Administrator";
    admin.department ||= "Administration";
    await admin.save();
    console.log(`Updated admin credentials for ${email}.`);
  } else {
    await Employee.create({
      name: "System Admin",
      email,
      password: hashedPassword,
      role: "admin",
      jobTitle: "Administrator",
      department: "Administration",
      phone: ""
    });
    console.log(`Created admin account for ${email}.`);
  }
} catch (error) {
  console.error("Unable to update admin credentials:", error.message);
  process.exitCode = 1;
} finally {
  await Employee.db.close();
}
