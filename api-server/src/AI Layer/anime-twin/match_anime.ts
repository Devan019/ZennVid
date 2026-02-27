import { pineconeIndex } from "../../utils/pinecone";
import { getImageEmbedding, getLocalImageEmbedding } from "../helpers/image_pipe";

const getMatchAnime = async ({
  imagePath,
}: {
  imagePath: string;
}) => {
  try {
    //do embedding
    const embRes = await getImageEmbedding(imagePath, "Human");
    if(!embRes) {
      console.log("No embedding result for query image");
      return null;
    }

    //get top
    const data =await pineconeIndex.query({
      topK: 1,
      vector: embRes,
      includeMetadata: true,
    })

    return data.matches?.[0]?.metadata ?? null;

  } catch (error) {
    console.error("Error in getMatchAnime:", error);
    return null;
  }
}

export { getMatchAnime };


// getMatchAnime({
//   imagePath: "tryout/Human Faces Dataset/AI-Generated Images/000123.jpg"
// }).then((result) => {
//   console.log("Match result:", result);
// }).catch((error) => {
//   console.error("Error in getMatchAnime:", error);
// });