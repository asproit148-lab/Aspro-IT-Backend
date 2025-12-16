// db/vectordb.js
import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (go up TWO directories: db/ -> src/ -> root/)
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

console.log("🔍 Checking environment variables...");
console.log("PINECONE_KEY exists:", !!process.env.PINECONE_KEY);
console.log("PINECONE_KEY value:", process.env.PINECONE_KEY ? "✅ Loaded" : "❌ Missing");

if (!process.env.PINECONE_KEY) {
  console.error("❌ PINECONE_KEY is undefined!");
  console.error("Current directory:", __dirname);
  console.error("Looking for .env at:", path.resolve(__dirname, "../.env"));
  throw new Error("PINECONE_KEY environment variable is not set");
}

const pc = new Pinecone({
  apiKey: process.env.PINECONE_KEY
});

export default pc;