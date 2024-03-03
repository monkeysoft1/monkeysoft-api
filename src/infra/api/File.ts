import fs from "fs";
import path from "path";
import AppError from "../../core/entity/AppError";
import HttpResponse from "./HttpResponse";

export default class File {
  sendGeneratedFile(filePath: string) {
    if (!fs.existsSync(filePath)) {
      throw new AppError("File generated not found", 500);
    }

    const size = fs.statSync(filePath);
    const name = path.basename(filePath);
    const stream = fs.createReadStream(filePath);

    stream.on("close", () => {
      fs.unlink(filePath, () => undefined);
    });

    const headers = {
      "content-disposition": `attachment;filename=${name}`,
      "content-length": size,
    };

    return HttpResponse.file(200, stream, headers);
  }
}
