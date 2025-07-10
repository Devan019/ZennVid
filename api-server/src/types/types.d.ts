import "@auth/express";
import e , { NextFunction, Request, Response } from 'express';

declare module "@auth/express" {
  interface User {
    _id: string;
    username: string;
    email: string;
    provider?: string;
  }

  interface Token {
    _id: string;
    username: string;
    email: string;
    provider?: string;
  }

  interface Session {
    user: {
      _id: string;
      username: string;
      email: string;
      provider?: string;
    };
  }
}



declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}


