import { NextFunction, Request, Response } from "express";

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any> | any;
const expressAsyncHandler = (fn: AsyncRequestHandler): AsyncRequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default expressAsyncHandler;
