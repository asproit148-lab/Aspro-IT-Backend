import app from "./app.js";
import { connectDB } from "./db/index.js";

// Do NOT use dotenv here on Vercel — Vercel injects env variables automatically
// dotenv.config();  <-- REMOVE THIS IN PRODUCTION

const PORT = process.env.PORT || 3000;

// Wrap server start in a function so Vercel doesn’t connect multiple times
const startServer = async () => {
  try {
    await connectDB();  // Ensure DB is connected

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

startServer();

// Export for Vercel serverless compatibility
export default app;
