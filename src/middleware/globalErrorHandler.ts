import e, { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
    err: any,
     req: Request, 
     res: Response, 
     next: NextFunction) {

let statusCode = 500
let message = "Internal Server Error"
let error = err;

//prismaClient Validation error handling
if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Validation Error";
    error = err.message;
} else if (err instanceof Prisma.PrismaClientKnownRequestError) {

if (err.code === "P2025") {
    statusCode = 400;
    message = "Resource Not Found";
    error = err.message;
    }

    statusCode = 400;
    message = "Database Error";
    error = err.message;
} else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    message = "Database Error";
    error = err.message;
}


res.status(statusCode).json({ message, error });

  console.error(err.stack);
  res.status(statusCode)
  res.json({ message: "Internal Server Error", error: err.message });
}
export default errorHandler;