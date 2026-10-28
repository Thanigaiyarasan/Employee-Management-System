import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const port = process.env.PORT || 5000;

try {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters.");
  }
  await connectDB();
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
} catch (error) {
  console.error("Unable to start the API:", error.message);
  process.exit(1);
}
