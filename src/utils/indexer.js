import pc from "../db/vectordb.js";
import { createEmbedding } from "./embedding.js";

const INDEX_NAME = "app-knowledge-base";

export const indexToPinecone = async ({ id, type, text, metadata }) => {
  const vector = await createEmbedding(text);

  const index = pc.index(INDEX_NAME);

  await index.upsert([
    {
      id: `${type}_${id}`,
      values: vector,
      metadata: {
        type,
        ...metadata
      }
    }
  ]);
};

export const deleteFromPinecone = async (type, id) => {
  const index = pc.index(INDEX_NAME);
  await index.deleteOne(`${type}_${id}`);
};
