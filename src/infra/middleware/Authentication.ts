import { NextFunction, Request, Response } from "express";
import AppError from "../../core/entity/AppError";
import GetSession from "../../core/usecase/session/GetSession";
import IConnection from "../database/IConnection";
import UserRepository from "../repository/UserRepository";

export default class Authentication {
  constructor(readonly connection: IConnection) {}

  execute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const whiteList = ["/signin"];
      if (whiteList.includes(req.url)) {
        return next();
      }

      const token = req.headers.authorization;
      if (!token) {
        res.status(401).json({ message: "Não autenticado" });
        return next();
      }

      const userRepository = new UserRepository(this.connection);
      const getSession = new GetSession(userRepository);

      await getSession.execute({ token });
      next();
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.status).json({ message: error.message });
      }

      return res.status(500).json({ message: error.message });
    }
  };
}
