import { NextFunction, Request, Response } from "express";

function errorHandler(
    err: any,
     req: Request, 
     res: Response, 
     next: NextFunction) {
  console.error(err.stack);
  res.status(500)
  res.json({ message: "Internal Server Error", error: err.message });
}
export default errorHandler;