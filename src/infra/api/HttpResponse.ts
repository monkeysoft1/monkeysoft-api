import { ReadStream } from "fs";
import { FileResponse, JsonResponse } from "./IHttpServer";

export default class HttpResponse {
  static json(status: number, data?: any, headers = {}): JsonResponse {
    return {
      data: data,
      status,
      headers,
    };
  }

  static file(status: number, stream: ReadStream, headers = {}): FileResponse {
    return {
      stream,
      status,
      headers,
    };
  }
}
