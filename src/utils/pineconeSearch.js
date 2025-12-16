import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import { createEmbedding } from "./embedding.js";

dotenv.config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_KEY
});

const INDEX_NAME = "app-knowledge-base";

export const searchKnowledgeBase = async (query, topK = 6) => {
  const vector = await createEmbedding(query);

  const index = pinecone.index(INDEX_NAME);

  const results = await index.query({
    vector,
    topK,
    includeMetadata: true
  });

  return results.matches || [];
};
