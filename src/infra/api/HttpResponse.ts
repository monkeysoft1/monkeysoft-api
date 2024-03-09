import { ReadStream } from "fs";
import { FileResponse, JsonResponse } from "./IHttpServer";

export default class HttpResponse {
  static formatData(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.formatData(item));
    }

    if (typeof data !== "object" || data === null) {
      return data;
    }

    const formattedData: any = {};

    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith("_") && key.length > 1) {
        const newKey = key.slice(1);
        formattedData[newKey.charAt(0) + newKey.slice(1)] = value;
      } else {
        formattedData[key] = value;
      }
    }

    return formattedData;
  }

  static json(status: number, data?: any, headers = {}): JsonResponse {
    return {
      data: this.formatData(data),
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
