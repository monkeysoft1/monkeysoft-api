import express, { Express, NextFunction, Request, Response } from "express";

import { Server } from "http";
import IHttpServer, { IParams } from "./IHttpServer";

export default class ExpressAdapter implements IHttpServer {
  app: Express;
  private _server: Server | undefined;

  constructor() {
    this.app = express();
    this.app.use(express.json({ limit: "5mb" }));
  }
  close(): void {
    this._server?.close();
  }

  public get server(): Server | undefined {
    return this._server;
  }

  listen(port: number, callback: () => void): void {
    this._server = this.app.listen(port, callback);
  }

  applyErrorMiddleware(callback: Function): void {
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      callback(error, req, res, next);
    });
  }

  applyMiddleware(callback: Function): void {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      callback(req, res, next);
    });
  }

  on(method: string, url: string, callback: Function): void {
    this.app[method as keyof Express](
      `${url}`,
      async function (req: Request, res: Response, next: Function) {
        const params = {
          headers: req.headers,
          params: req.params,
          query: req.query,
        } as IParams;

        callback(params, req.body)
          .then((result: any) => {
            const { data, headers, stream } = result;

            Object.entries(headers).forEach((header: any) => {
              res.header(header[0], header[1]);
            });

            if (stream) {
              stream.pipe(res);
              res.on("close", () => stream?.close());
              return;
            }

            res.json(data);
          })
          .catch(next);
      }
    );
  }
}
