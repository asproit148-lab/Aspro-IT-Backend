import pc from "../db/vectordb.js";
import { createEmbedding } from "./embedding.js";
import dotenv from "dotenv";

dotenv.config();
const INDEX_NAME = "app-knowledge-base";

// Hardcoded AsproIT info
const ASPROIT_INFO = {
  id: "asproit_info_001",
  type: "contact",
  name: "AsproIT",
  email: "admin@asproit.com",
  contact: "+91-9128444000",
  location: "Khajpura, Patna, India",
  address: "1st Floor Pratiksha Bhawan, Khajpura, Patna, India - 800014",
  owner: "Sanket chauhan"
};

export const seedAsproitInfo = async () => {
  // Combine fields into text for embedding
  const textForEmbedding = Object.values(ASPROIT_INFO)
    .filter(Boolean)
    .join(", ");

  const vector = await createEmbedding(textForEmbedding);

  const index = pc.index(INDEX_NAME);

  await index.upsert([
    {
      id: ASPROIT_INFO.id,
      values: vector,
      metadata: ASPROIT_INFO
    }
  ]);

  console.log("✅ Indexed AsproIT static info in Pinecone!");
};

// Run the seeder
seedAsproitInfo()
