import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  StreamableFile
} from "@nestjs/common";
import { ProcessService } from "./process.service";
import { createReadStream } from "fs";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("process")
export class ProcessController {
  constructor(private readonly processService: ProcessService) {
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async uppercaseFile(@UploadedFile() file: Express.Multer.File) {
    const modifyFilePath = await this.processService.processPdf(file.path);
    const fileResult = createReadStream(modifyFilePath);
    return new StreamableFile(fileResult);
  }
}
