import e, { Request, Response } from "express";
import connectToMongo from "./utils/mongoConnection";
import { ExpressAuth, getSession } from "@auth/express";
import { authConfig } from "./auth/auth";
import cookieParser from "cookie-parser";
import { AuthRouter } from "./auth/route";
import { NextFunction } from "express-serve-static-core";
import cors from "cors"
const app = e();
const corsOptions = {
            origin: ['http://localhost:3000', 'https://your-frontend-domain.com'], // Whitelist specific origins
            methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
            allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
            credentials: true // Allow sending cookies/authentication headers
        };

app.use(cookieParser());
app.use(cors(corsOptions));

export async function authSession(req: Request, res: Response, next: NextFunction) {
  res.locals.session = await getSession(req, authConfig) ?? { user: null };
  next()
}


app.use(authSession);

app.get("/", async (req, res) => {
  await connectToMongo();
  res.send("Hello World!");
});

app.set("trust proxy", true)
app.use("/auth/", ExpressAuth(authConfig));
app.use(e.json());
app.use("/api/auth", AuthRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});