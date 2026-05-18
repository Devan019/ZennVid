import e from "express";
import cookieParser from "cookie-parser";
import { AuthRouter } from "./auth/route";
import cors from "cors"
import { OAuthRouter } from "./oauth/route";
import { ApiRouter } from "./api/route";
import connectToMongo from "./utils/mongoConnection";
import { FRONTEND_URL, IP_ADDRESS, PORT } from "./env_var";
import JobRouter from "./sse/videogen_event";
import worker from "./worker";


// import { rateLimit } from 'express-rate-limit'
const app = e();
app.use(e.json());

const corsOptions = {
  origin: [FRONTEND_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// const limiter = rateLimit({
// 	windowMs: 1 * 60 * 1000,
// 	limit: 30, 
// 	standardHeaders: 'draft-8', 
// 	legacyHeaders: false,
// 	ipv6Subnet: 56, 
//   handler : (req, res, next, options)  => {
//      res.status(options.statusCode || 429).json({
//       SUCCESS: false,
//       MESSAGE: "Too many requests, please try again after a minute",
//     });
//   }
// })
app.set("trust proxy", 1);
// app.use(limiter)

app.use(e.static("public"));

app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/auth", AuthRouter);
app.use("/oauth", OAuthRouter);
app.use("/api", ApiRouter);
app.use("/jobstatus", JobRouter);

const startServer = async () => {
  app.listen(PORT, IP_ADDRESS, () => {
    console.log(`Server is running on port http://${IP_ADDRESS}:${PORT}`);
  });

  // // //mongo connection
  await connectToMongo();

  // //run worker
  await worker.run();
  console.log("✅ Worker started and ready to process jobs...");

}

startServer()