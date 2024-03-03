import { NextFunction, Request, Response } from "express";
import AppError from "../../core/entity/AppError";

export default class ErrorMiddleware {
  static execute(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Error=> ", error.stack);
    if (error instanceof AppError) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message });
  }
}
