import { Pinecone } from "@pinecone-database/pinecone";
import { PINECONE_API_KEY, PINECONE_INDEX_NAME } from "../env_var";

if(!PINECONE_API_KEY || !PINECONE_INDEX_NAME) {
  throw new Error("Pinecone API key or index name not defined in environment variables");
}

const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY});
const indexName = PINECONE_INDEX_NAME;
const pineconeIndex = pinecone.index({
  name: indexName,
});


export { pinecone, indexName, pineconeIndex};