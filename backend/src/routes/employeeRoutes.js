import { Router } from "express";
import bcrypt from "bcryptjs";
import Employee from "../models/Employee.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = Router();
const fields = ["name", "email", "jobTitle", "department", "phone"];

function validateEmployee(body, creating) {
  const errors = [];
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const jobTitle = String(body.jobTitle || "").trim();
  const department = String(body.department || "").trim();

  if (name.length < 2 || name.length > 80) errors.push("Name must be 2–80 characters.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Enter a valid email address.");
  if (!jobTitle || jobTitle.length > 80) errors.push("Job title is required (up to 80 characters).");
  if (!department || department.length > 80) errors.push("Department is required (up to 80 characters).");
  if (String(body.phone || "").length > 30) errors.push("Phone number cannot exceed 30 characters.");
  if (creating && (typeof body.password !== "string" || body.password.length < 8)) {
    errors.push("Password must be at least 8 characters.");
  }
  return {
    errors,
    values: {
      name,
      email,
      jobTitle,
      department,
      phone: String(body.phone || "").trim()
    }
  };
}

router.get("/me", requireAuth, (req, res) => {
  res.json({ employee: req.user });
});

router.use(requireAuth, requireAdmin);

router.get("/", async (req, res, next) => {
  try {
    const search = String(req.query.search || "").trim();
    const query = search
      ? {
          $or: fields.map((field) => ({
            [field]: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" }
          }))
        }
      : {};
    const employees = await Employee.find(query).sort({ name: 1 });
    res.json({ employees });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { errors, values } = validateEmployee(req.body, true);
    if (errors.length) return res.status(400).json({ message: errors.join(" ") });
    const employee = await Employee.create({
      ...values,
      password: await bcrypt.hash(req.body.password, 12),
      role: "employee"
    });
    res.status(201).json({ employee });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "That email address is already in use." });
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { errors, values } = validateEmployee(req.body, false);
    if (errors.length) return res.status(400).json({ message: errors.join(" ") });
    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id, role: "employee" },
      values,
      { new: true, runValidators: true }
    );
    if (!employee) return res.status(404).json({ message: "Employee not found." });
    res.json({ employee });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "That email address is already in use." });
    if (error.name === "CastError") return res.status(400).json({ message: "Invalid employee ID." });
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const employee = await Employee.findOneAndDelete({
      _id: req.params.id,
      role: "employee"
    });
    if (!employee) return res.status(404).json({ message: "Employee not found." });
    res.json({ message: "Employee deleted." });
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json({ message: "Invalid employee ID." });
    next(error);
  }
});

export default router;
