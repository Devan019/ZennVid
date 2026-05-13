import { indexName, pinecone, pineconeIndex } from "../../utils/pinecone";
import { animeData } from "../../data/anime";
import { getLocalImageEmbedding } from "../helpers/image_pipe";

const createAnimeIndex = async () => {
  try {
    // 1.Check if index exists
    const existingIndexes = await pinecone.listIndexes();
    const isExist = existingIndexes.indexes?.some(
      (index) => index.name === indexName
    );

    if (!isExist) {
      await pinecone.createIndex({
        name: indexName,
        metric: "cosine",
        dimension: 512,
        spec: {
          serverless: { cloud: "aws", region: "us-east-1" },
        },
      });

    }


    // 2. embeddings
    for (const character of animeData) {
      const { id, name, anime, image, description, genre, type } = character;


      const emb = await getLocalImageEmbedding(image, "Anime");


      if (!emb) {
        console.log("Skipping due to missing embedding:", name);
        continue;
      }

      // 4. Upsert
      await pineconeIndex.upsert({
        records: [
          {
            id: id,
            values: emb,
            metadata: {
              name,
              anime,
              description,
              image,
              genre,
              type,
            },
          },
        ],
      });

      
    }

    return true;

  } catch (error) {
    console.log("Error creating Pinecone index:", error);
    return false;
  }
};

// createAnimeIndex();
// export { createAnimeIndex };