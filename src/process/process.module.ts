import { Module } from "@nestjs/common";
import { ProcessService } from "./process.service";
import { ProcessController } from "./process.controller";
import { diskStorage } from "multer";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        }
      })
    })
  ],
  controllers: [ProcessController],
  providers: [ProcessService]
})
export class ProcessModule {
}
