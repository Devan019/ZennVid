import fs from "fs";
import { formatResponse } from "../../utils/formateResponse";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { getMatchAnime } from "../../AI Layer/anime-twin/match_anime";

export const animeMatching = async (req: any, res: any) => {
  let imagePath;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    imagePath = req.file.path;

    //upload to cloudinary
    const data = await uploadToCloudinary({
      filePath: imagePath,
      folder: "zennvid/anime-matching",
      resource_type: "image",
    })

    //get matching anime
    const matchAnime = await getMatchAnime({
      imagePath: data.url,
    })

    return formatResponse(res, 200, "Anime matching successful", true, matchAnime);

  } catch (err:any) {
    console.log(err);
    return formatResponse(res, 500, "Anime matching failed", false, null, err.message);
  } finally {
    // Delete file whether success or error
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (err) => {
        if (err) console.error("File delete error:", err);
      });
    }
  }
};
