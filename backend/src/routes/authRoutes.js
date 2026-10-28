import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/login", async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = req.body.password;
    if (!email || typeof password !== "string" || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const employee = await Employee.findOne({ email }).select("+password");
    if (!employee || !(await bcrypt.compare(password, employee.password))) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }
    const token = jwt.sign(
      { sub: employee.id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
    res.json({ token, user: employee });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
