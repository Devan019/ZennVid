import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from '@aws-sdk/lib-storage';
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { S3_ACCESS_KEY, S3_API, S3_BUCKET_NAME, S3_PUBLIC_ACCESS_API, S3_REGION, S3_SECRET_KEY } from "../env_var";

if (!S3_ACCESS_KEY || !S3_SECRET_KEY || !S3_REGION) {
  throw new Error("S3_ACCESS_KEY, S3_SECRET_KEY, and S3_REGION must be defined in environment variables");
}

const s3 = new S3Client({
  endpoint: S3_API,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
  region: S3_REGION,
})

const helperUpload = async (
  { prefix, Body, contentType }: { prefix: string, Body: any, contentType: string }
) => {
  try {

    const uploadedFile = new Upload({
      client: s3,
      params: {
        Bucket: S3_BUCKET_NAME,
        Key: `${prefix}/${uuidv4()}`,
        Body,
        ContentType: contentType,
      }
    });


    const data =  await uploadedFile.done();

    return {
      Key: data.Key,
      Location: getS3PublicUrl(data.Key!)
    }
  } catch (error) {
    console.log("Error uploading file to S3:", error);
    return null;
  }
}

const getS3PublicUrl = (key: string) => {
  if(!key) return null;
  return `${S3_PUBLIC_ACCESS_API}/${key}`;
}

//upload file to s3
const uploadFileToS3 = async (
  { prefix, filePath, contentType }: { prefix: string, filePath: string, contentType: string }
) => {
  return helperUpload({ prefix, Body: fs.createReadStream(filePath), contentType });
}

//upload url content to s3
const uploadUrlToS3 = async (
  { prefix, url, contentType }: { prefix: string, url: string, contentType: string }
) => {
  try {
    //1. download the content from url to buffer
    const res = await axios.get(url, { responseType: 'arraybuffer' });

    //2. upload buffer to s3
    return await helperUpload({ prefix, Body: Buffer.from(res.data), contentType });
  } catch (error) {
    return null;
  }
}

//upload buffer to s3
const uploadBufferToS3 = async (
  { prefix, buffer, contentType }: { prefix: string, buffer: Buffer, contentType: string }
) => {
  return helperUpload({ prefix, Body: buffer, contentType });
}

//delete file from s3
const deleteFileFromS3 = async (key: string) => {
  try {
    const command = new DeleteObjectCommand({
      Key: key,
      Bucket: S3_BUCKET_NAME,
    });
    await s3.send(command);
  } catch (error) {
    console.log("Error deleting file from S3:", error);
    return null;
  }
}


//demo
// const demo = async () => {
//   console.time("Upload")
//   await uploadFileToS3({
//     filePath: "C:\\Users\\devan\\Downloads\\a33872f1-e90c-4b6f-81be-415b158f31a8.mp4",
//     prefix: "test",
//     contentType: "video/mp4"
//   })
//   console.timeEnd("Upload")
// }
// demo();

export { uploadFileToS3, uploadBufferToS3, deleteFileFromS3, uploadUrlToS3 }