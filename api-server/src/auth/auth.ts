import { ExpressAuthConfig } from "@auth/express";
import { Provider } from "../constants/provider";
import Google from "@auth/express/providers/google";
import { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_SECRET } from "../env_var";
import connectToMongo from "../lib/mongoConnection";
import { User } from "./model/User";
import ExpressError from "../lib/ExpressError";

export const authConfig: ExpressAuthConfig = {
  providers: [
    Google({
      clientId: AUTH_GOOGLE_ID,
      clientSecret: AUTH_GOOGLE_SECRET,
      name: "google",
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


        await User.create({
          email: user.email,
          username: user.name,
          provider: account?.provider ?? Provider.CREDENTIALS,
        });

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },

  },
};