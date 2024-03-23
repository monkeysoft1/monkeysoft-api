import { ReadStream } from "fs";
export default interface IHttpServer {
  on(method: string, url: string, callback: Function): void;
  listen(port: number, callback: Function): void;
  applyMiddleware(callback: Function): void;
  applyErrorMiddleware(callback: Function): void;
}

export interface IParams {
  headers: Record<string, string>;
  params: Record<string, string>;
  query: Record<string, string>;
}

type HttpBaseResponse = {
  headers?: any;
  status: number;
};

export type JsonResponse = {
  data: any;
} & HttpBaseResponse;

export type FileResponse = {
  stream?: ReadStream;
} & HttpBaseResponse;

export type IHttpResponse = JsonResponse & FileResponse;
