import { ExpressAuthConfig } from "@auth/express";
import { Provider } from "../constants/provider";
import Google from "@auth/express/providers/google";
import { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_SECRET } from "../env_var";
import { skipCSRFCheck } from "@auth/core";
import connectToMongo from "../utils/mongoConnection";
import { User } from "./model/User";
import ExpressError from "../utils/ExpressError";
import Credentials from "@auth/express/providers/credentials"
import { passwordCompare } from "../utils/passwordCompare";

export const authConfig: ExpressAuthConfig = {
  providers: [
    Google({
      clientId: AUTH_GOOGLE_ID,
      clientSecret: AUTH_GOOGLE_SECRET,
      name: "google",
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
        username: {},
        provider: {}
      },

      async authorize(credentials, request) {
        let user = null;
        try {
          await connectToMongo();
          const { email, password, username } = credentials as {
            username?: string,
            email?: string,
            password: string,
          };

          if (!password) {
            throw new ExpressError(400, "Password is required");
          }

          user = await User.findOne({ $or: [{ email }, { username }] });

          if (!user) {
            throw new ExpressError(404, "User not found");
          }

          if (user.provider !== Provider.CREDENTIALS) {
            throw new ExpressError(409, "User already exists with different provider");
          }

          const isPasswordValid = await passwordCompare(password, user.password);

          if (!isPasswordValid) {
            throw new ExpressError(401, "Invalid credentials");
          }

          return {
            _id: user._id.toString(),
            email: user.email,
            username: user.username,
            provider: user.provider,
          };


        } catch (error) {
          console.error(error);
          throw new ExpressError(500, "Internal server error");
        }

      },
    })

  ],
  secret: AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token._id = user.id;
        token.email = user.email;
        token.username = user.name ?? "";
        token.provider = account?.provider ?? Provider.CREDENTIALS;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token._id ? String(token._id) : "";
        session.user.email = token.email ?? "";
        session.user.name = token.name ?? "";
        session.user.provider = token.provider ? String(token.provider) : Provider.CREDENTIALS;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      try {
        await connectToMongo();
        const exitUser = await User.findOne({
          email: user.email,
        })
        if (exitUser) {
          if (exitUser?.provider !== account?.provider) {
            throw new ExpressError(409, "User already exists with different provider");
          }
          return true;
        }
        if (account?.provider) {
          await User.create({
            email: user.email,
            username: user.name,
            provider: account.provider
          });
        }

        console.log("User created successfully");

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  },
  skipCSRFCheck,
};