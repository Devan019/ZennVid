import { Request, Response } from "express";
import expressAsyncHandler from "../../utils/expressAsync";
import { ApiSchema } from "./schema";

import OpenApi from "./model";
import { formatResponse } from "../../utils/formateResponse";
import { decrypt, encrypt, generateApiKey, sha256Hex } from "../../utils/cyrpto";

import { sendMail } from "../../utils/SendMail";
import { keyTemplate } from "./key-template";
import { OPENAPI_SECERT } from "../../env_var";
import redisClient from "../../utils/redisClient";

const getApisByUser = async ({ id }: { id: string }) => {
  try {

    const apis = await OpenApi.find({ user: id }).select("-apps.apiKeyEncrypted -apps.apiKeyHash -__v -user").lean();
    return apis;
  } catch (error) {
    return null;
  }
}

export const CreateNewApp = expressAsyncHandler(async (req: Request, res: Response) => {
  try {

    const { name } = ApiSchema.parse(req.body);
    const secret = OPENAPI_SECERT;
    if (!secret) {
      return formatResponse(res, 500, "Encryption secret not set", false, {});
    }
    const apiKey = await generateApiKey();
    const hashedKey = await sha256Hex(apiKey);
    const encryptKey = await encrypt(apiKey, secret);

    const user = req.user;

    const existing = await OpenApi.findOne({ user: user.id }).lean();


    if (existing) {
      const newApp = await OpenApi.findOneAndUpdate(
        { user: user.id },
        {
          $push: {
            apps: {
              appName: name,
              apiKeyHash: hashedKey,
              apiKeyEncrypted: encryptKey
            }
          }
        },
        { new: true }
      );


      await sendMail({
        to: user?.email!,
        subject: `Your API Key for ${name} | ZennVid`,
        from: "onboarding@resend.dev",
        html: keyTemplate({ name, apiKey, user })
      });
      await redisClient.del(`zennvid:apps:${user.id}`);
      await redisClient.del(`zennvid:dashboard:${user.id}`);

      return formatResponse(res, 201, "New App Created Successfully", true, {
        appName: name,
        created_at: newApp?.apps[newApp.apps.length - 1].created_at,
        _id: newApp?.apps[newApp.apps.length - 1]._id
      });
    }

    const newApp = await OpenApi.create({
      user: user.id,
      apps: [{
        appName: name,
        apiKeyHash: hashedKey,
        apiKeyEncrypted: encryptKey
      }]
    });

    await sendMail({
      to: user?.email!,
      subject: `Your API Key for ${name} | ZennVid`,
      from: "onboarding@resend.dev",
      html: keyTemplate({ name, apiKey, user })
    });
    await redisClient.del(`zennvid:apps:${user.id}`);
    await redisClient.del(`zennvid:dashboard:${user.id}`);

    return formatResponse(res, 201, "New App Created Successfully", true, {
      appName: name,
      created_at: newApp?.apps[newApp.apps.length - 1].created_at,
      _id: newApp?.apps[newApp.apps.length - 1]._id
    });
  } catch (error: any) {
    console.log(error.message)
    return formatResponse(res, 500, "Internal Server Error", false, { error: error.message });
  }
});

export const GetAllApps = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const user = req.user?.id;
    const apps = await redisClient.get(`zennvid:apps:${user}`)
    if (apps) {
      return formatResponse(res, 200, "Apps Fetched Successfully", true, JSON.parse(apps));
    }
    const apis = await getApisByUser({ id: user! });
    await redisClient.set(`zennvid:apps:${user}`, JSON.stringify({apis}), 'EX', 60 * 60);
    if (!apis) {
      return formatResponse(res, 500, "Internal Server Error", false, {});
    }
    return formatResponse(res, 200, "Apps Fetched Successfully", true, { apis });
  } catch (error: any) {
    return formatResponse(res, 500, "Internal Server Error", false, { error: error.message });
  }
});

export const SendKeyToEmail = expressAsyncHandler(async (req: Request, res: Response) => {
  try {

    const { appId } = req.body;
    const user = req.user;
    const secret = process.env.ENCRYPTION_SECRET

    if (!secret) {
      return formatResponse(res, 500, "Encryption secret not set", false, {});
    }

    const api = await OpenApi.findOne({ user: user?.id, "apps._id": appId }).select("apps.$").lean();

    const apps = api?.apps;
    if (!apps || apps.length === 0) {
      return formatResponse(res, 404, "App not found", false, {});
    }
    const app = apps[0];

    const decryptedKey = await decrypt({ iv: app.apiKeyEncrypted?.iv ?? "", cipher: app.apiKeyEncrypted?.cipher ?? "" }, secret);

    if (!decryptedKey) {
      return formatResponse(res, 500, "Failed to decrypt API key", false, {});
    }

    //send mail
    await sendMail({
      to: user?.email!,
      subject: `Your API Key for ${app.appName} | ZennVid`,
      from: "onboarding@resend.dev",
      html: keyTemplate({ name: app.appName, apiKey: decryptedKey, user })
    });


    return formatResponse(res, 200, "App Fetched Successfully", true, { data: { message: "API key has been sent to your email!" } });
  } catch (error: any) {
    return formatResponse(res, 500, "Internal Server Error", false, { error: error.message });
  }
});

export const dashboardStats = expressAsyncHandler(async (req: Request, res: Response) => {
  try {

    const userId = req.user.id;
    const stats = await redisClient.get(`zennvid:dashboard:${userId}`);
    if (stats) {
      return formatResponse(res, 200, "Apps stats", true, JSON.parse(stats))
    }

    const openapi = await OpenApi.findOne({ user: userId })

    if (!openapi) {
      return formatResponse(res, 200, "Apps stats", true, {
        "Api Calls": 0,
        "Apps": 0,
        "Remaing Credits": req.user.credits
      })
    }

    await redisClient.set(`zennvid:dashboard:${userId}`, JSON.stringify({
      "Api Calls": openapi.apiCalls,
      "Apps": openapi.apps.length,
      "Remaing Credits": req.user.credits
    }), 'EX', 60 * 60)

    return formatResponse(res, 200, "Apps stats", true, {
      "Api Calls": openapi.apiCalls,
      "Apps": openapi.apps.length,
      "Remaing Credits": req.user.credits
    })

  } catch (error: any) {
    return formatResponse(res, 500, "Internal Server Error", false, { error: error.message });
  }
});
