import { Controller, Param, Post, Put, Req, Res } from '@nestjs/common';
import { TranscodeService } from './transcode.service';
import { Request, Response } from 'express';
import * as fs from 'fs';
import { spawn } from 'child_process';
import { join } from 'path';

@Controller('rtmp-stream')
export class TranscodeController {
  constructor(private readonly transcodeService: TranscodeService) {}

  /**
   * 테스트 중
   * ffmpeg에서 PUT 메서드로 보내면 m3u8과 ts를 보내나, 정상적으로 받지 못함
   * 해상도 분리 후 받는 방법 찾아야 함
   */
  @Put('hls/:streamKey/:filename')
  updateHlsFiles(
    @Req() req: Request,
    @Param() param?: { streamKey: string; filename: string },
  ) {
    const { streamKey, filename } = param;

    const folderPath = `/opt/app/stream/${streamKey}`;
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`폴더 생성: ${folderPath}`);
    } else {
      console.log(`폴더 이미 존재: ${folderPath}`);
    }

    const filePath = join(folderPath, filename);
    const writeStream = fs.createWriteStream(filePath);

    req.on('data', (chunk) => {
      console.log(`Get data: ${filename}`);
      writeStream.write(chunk);
    });

    req.on('end', () => {
      writeStream.end();
      console.log('File uploaded successfully');
    });
  }

  // @Post('hls/:streamKey')
  // hls(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Param('streamKey') streamKey: string,
  // ) {
  //   const folderPath = `/opt/app/stream/${streamKey}`;
  //   if (!fs.existsSync(folderPath)) {
  //     fs.mkdirSync(folderPath, { recursive: true });
  //     console.log(`폴더 생성: ${folderPath}`);
  //   } else {
  //     console.log(`폴더 이미 존재: ${folderPath}`);
  //   }

  //   // const fileStream = fs.createWriteStream(
  //   //   join(folderPath, `receivedStream.flv`),
  //   // );
  //   // req.pipe(fileStream);

  //   // const ffmpegProcess = this.transcodeService.hls(streamKey);

  //   req.pipe(ffmpegProcess.stdin);
  //   return 'ok';
  // }
}
