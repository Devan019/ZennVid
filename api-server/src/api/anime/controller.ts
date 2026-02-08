import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { formatResponse } from "../../utils/formateResponse";
import { AI_URI } from "../../env_var";

export const animeMatching = async (req: any, res: any) => {
  let imagePath;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    imagePath = req.file.path;

    const form = new FormData();
    form.append("file", fs.createReadStream(imagePath));

    const response = await axios.post(
      `${AI_URI}/anime-matching`,
      form,
      { headers: form.getHeaders() }
    );

    return formatResponse(res, 200, "Anime matching successful", true, response.data);

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
