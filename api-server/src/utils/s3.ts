import { DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { S3_ACCESS_KEY, S3_API, S3_PRIVATE_BUCKET, S3_CDN, S3_REGION, S3_SECRET_KEY, S3_PUBLIC_BUCKET } from "../env_var";

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

const generateSignedUrl = async (key: string, Bucket: string, expiresIn: number = 3600) => {
  try {
    const command = new GetObjectCommand({
      Bucket,
      Key: key,
    });
    const url = await getSignedUrl(s3 as any, command as any, { expiresIn });
    return url;
  } catch (error) {
    console.log("Error generating signed URL:", error);
    return null;
  }
}


const helperUpload = async (
  { prefix, Body, contentType, Bucket }: { prefix: string, Body: any, contentType: string, Bucket: string }
) => {
  try {

    const uploadedFile = new Upload({
      client: s3,
      params: {
        Bucket,
        Key: `${prefix}/${uuidv4()}`,
        Body,
        ContentType: contentType,
      }
    });


    const data = await uploadedFile.done();
    const url = await generateSignedUrl(data.Key!, Bucket);

    return {
      Key: data.Key,
      Location: url
    }
  } catch (error) {
    console.log("Error uploading file to S3:", error);
    return null;
  }
}

const getS3PublicUrl = (key: string) => {
  if (!key) return null;
  return `${S3_CDN}/${key}`;
}

//upload file to s3
const uploadFileToS3 = async (
  { prefix, filePath, contentType, Bucket }: { prefix: string, filePath: string, contentType: string, Bucket: string }
) => {
  return helperUpload({ prefix, Body: fs.createReadStream(filePath), contentType, Bucket });
}

//upload url content to s3
const uploadUrlToS3 = async (
  { prefix, url, contentType, Bucket }: { prefix: string, url: string, contentType: string, Bucket: string }
) => {
  try {
    //1. download the content from url to buffer
    const res = await axios.get(url, { responseType: 'arraybuffer' });

    //2. upload buffer to s3
    return await helperUpload({ prefix, Body: Buffer.from(res.data), contentType, Bucket });
  } catch (error) {
    return null;
  }
}

//upload buffer to s3
const uploadBufferToS3 = async (
  { prefix, buffer, contentType, Bucket }: { prefix: string, buffer: Buffer, contentType: string, Bucket: string }
) => {
  return helperUpload({ prefix, Body: buffer, contentType, Bucket });
}

//move private media to public
const moveKeyToPublicS3 = async ({
  key,
  contentType
}: {
  key: string,
  contentType: string
}) => {
  try {
    //1. get signed url for private s3
    const surl = await generateSignedUrl(key, S3_PRIVATE_BUCKET!);

    if (!surl) {
      console.log(`Failed to generate signed URL for key ${key}`);
      return null;
    }

    //2. upload to public s3 and get new url and key
    const res = await axios.get(surl, { responseType: 'arraybuffer' });

    const uploadedFile = new Upload({
      client: s3,
      params: {
        Bucket: S3_PUBLIC_BUCKET!,
        Key:key,
        Body: Buffer.from(res.data),
        ContentType: contentType,
      }
    });


    const data = await uploadedFile.done();

    return {
      Key: data.Key,
      Location: getS3PublicUrl(data.Key!)
    }

  } catch (error) {
    console.log("Error moving file to public S3:", error);
  }
}

//move public media to private
const moveKeyToPrivateS3 = async ({
  key,
  contentType
} :{
  key: string,
  contentType: string
}) => {
  try {
    //1. get signed url for public s3
    const surl = getS3PublicUrl(key);

    if (!surl) {
      console.log(`Failed to get public URL for key ${key}`);
      return null;
    }

    //2. upload to private s3 and get new url and key
    const res = await axios.get(surl, { responseType: 'arraybuffer' });
    const uploadedFile = new Upload({
      client: s3,
      params: {
        Bucket: S3_PRIVATE_BUCKET!,
        Key:key,
        Body: Buffer.from(res.data),
        ContentType: contentType,
      }
    });

    const data = await uploadedFile.done();

    return {
      Key: data.Key,
      Location: getS3PublicUrl(data.Key!)
    }

  } catch (error) {
    console.log("Error moving file to private S3:", error);
  }
}


//delete file from s3
const deleteFileFromS3 = async (key: string, Bucket: string) => {
  try {
    const command = new DeleteObjectCommand({
      Key: key,
      Bucket,
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

export { uploadFileToS3, uploadBufferToS3, deleteFileFromS3, uploadUrlToS3, getS3PublicUrl, generateSignedUrl, moveKeyToPublicS3, moveKeyToPrivateS3 };