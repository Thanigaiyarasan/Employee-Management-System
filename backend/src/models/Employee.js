import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [2, "Name must be at least 2 characters."],
      maxlength: [80, "Name cannot exceed 80 characters."]
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."]
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
      required: true
    },
    jobTitle: {
      type: String,
      required: [true, "Job title is required."],
      trim: true,
      maxlength: [80, "Job title cannot exceed 80 characters."]
    },
    department: {
      type: String,
      required: [true, "Department is required."],
      trim: true,
      maxlength: [80, "Department cannot exceed 80 characters."]
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [30, "Phone number cannot exceed 30 characters."],
      default: ""
    }
  },
  { timestamps: true }
);

employeeSchema.set("toJSON", {
  transform(_document, result) {
    delete result.password;
    delete result.__v;
    return result;
  }
});

export default mongoose.model("Employee", employeeSchema);
