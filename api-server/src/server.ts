import e from "express";
import cookieParser from "cookie-parser";
import { AuthRouter } from "./auth/route";
import cors from "cors"
import { TestRouter } from "./test/route";
import { OAuthRouter } from "./oauth/route";
import { ApiRouter } from "./api/route";
import connectToMongo from "./utils/mongoConnection";
import { rateLimit } from 'express-rate-limit'
const app = e();
app.use(e.json());
const corsOptions = {
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true 
};

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	limit: 30, 
	standardHeaders: 'draft-8', 
	legacyHeaders: false,
	ipv6Subnet: 56, 
})
app.set("trust proxy", false);
// app.use(limiter)

app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/auth", AuthRouter);
app.use("/test", TestRouter);
app.use("/oauth", OAuthRouter);
app.use("/api", ApiRouter);

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });

  await connectToMongo();
}

startServer()