import e, { Request, Response } from "express";
import connectToMongo from "./lib/mongoConnection";
import { ExpressAuth, getSession } from "@auth/express";
import { authConfig } from "./auth/auth";
import cookieParser from "cookie-parser";
import { AuthRouter } from "./auth/route";
import { NextFunction } from "express-serve-static-core";

const app = e();

app.use(cookieParser());

export async function authSession(req: Request, res: Response, next: NextFunction) {
  res.locals.session = await getSession(req, authConfig) ?? {user:null};
  next()
}


app.use(authSession);

app.get("/", async (req, res) => {
  await connectToMongo();
  res.send("Hello World!");
});

app.set("trust proxy", true)
app.use("/auth", ExpressAuth(authConfig));

app.use("/authuser", AuthRouter);

app.get("/signin", (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Sign In</h1>
        <a href="/auth/signin?provider=google">
          <button>Login with Google</button>
        </a>
      </body>
    </html>
  `);
});

app.get("/profile",  (req: Request, res: Response) => {
  if (!req.user) {
     res.status(401).send("Unauthorized");
  }
  res.send(req.user);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});