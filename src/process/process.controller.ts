import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile
} from "@nestjs/common";
import { ProcessService } from "./process.service";
import { createReadStream } from "fs";
import { FileInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { PDFParser } from "pdf-lib";

@Controller("process")
export class ProcessController {
  constructor(private readonly processService: ProcessService) {
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async uppercaseFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    const modifyFilePath = await this.processService.processPdf(file.path);
    const fileResult = createReadStream(modifyFilePath);
    return new StreamableFile(fileResult);
  }
}
