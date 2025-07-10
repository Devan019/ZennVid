import NextAuth from "next-auth";

declare module "next-auth"{
  interface User{
    _id : string;
    username : string;
    email : string;
    provider?: string;
    // role : string;
  }
}

declare module "next-auth/jwt"{
   interface JWT{
    _id : string;
    username : string;
    email : string;
    provider?: string;
    // role : string;
  }
}