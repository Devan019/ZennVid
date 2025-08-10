import e from "express";
import cookieParser from "cookie-parser";
import { AuthRouter } from "./auth/route";
import cors from "cors"
import { TestRouter } from "./test/route";
import { OAuthRouter } from "./oauth/route";
import { ApiRouter } from "./api/route";
const app = e();
app.use(e.json());
const corsOptions = {
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'], // Whitelist specific origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true // Allow sending cookies/authentication headers
};

app.use(cookieParser());
app.use(cors(corsOptions));

app.set("trust proxy", true)

app.use("/auth", AuthRouter);
app.use("/test", TestRouter);
app.use("/oauth", OAuthRouter);
app.use("/api", ApiRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});