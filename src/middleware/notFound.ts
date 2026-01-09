import { date } from "better-auth/*";
import { Request, Response } from "express";


export function notFoundHandler(req:Request, res:Response) {
  res.status(404).json({ error: "Resource Not Found" , path: req.originalUrl, method: req.method,date: new Date().toISOString()});
}