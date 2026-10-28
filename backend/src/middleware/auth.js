import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication is required." });
  }

  let payload;
  try {
    payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Your session is invalid or has expired." });
  }

  try {
    const employee = await Employee.findById(payload.sub);
    if (!employee) {
      return res.status(401).json({ message: "This account is no longer available." });
    }
    req.user = employee;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Administrator access is required." });
  }
  next();
}
