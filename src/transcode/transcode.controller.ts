import { Controller, Param, Post, Req, Res } from "@nestjs/common";
import { TranscodeService } from "./transcode.service";
import { Request, Response } from "express";
import * as fs from "fs";
import { spawn } from "child_process";
import { join } from 'path';

@Controller("rtmp-stream")
export class TranscodeController {
  constructor(private readonly transcodeService: TranscodeService) {}

  @Post("hls/:streamKey")
  hls(
    @Req() req: Request,
    @Res() res: Response,
    @Param("streamKey") streamKey: string,
  ) {
    const folderPath = `/opt/app/stream/${streamKey}`;
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`폴더 생성: ${folderPath}`);
    } else {
      console.log(`폴더 이미 존재: ${folderPath}`);
    }
    
    // const fileStream = fs.createWriteStream(
    //   join(folderPath, `receivedStream.flv`),
    // );
    // req.pipe(fileStream);

    // const ffmpegProcess = this.transcodeService.hls(streamKey);
    
    const ffmpegProcess = spawn('ffmpeg', [
      '-i', 'pipe:0',
      '-c:v', 'libx264',
      '-c:a', 'aac',
      '-f', 'hls',
      '-hls_playlist_type', 'event',
      '-map', '0:v', '-map', '0:a', '-map', '0:v', '-map', '0:a',
      '-b:v:0', '2500k', '-b:a:0', '128k', '-b:v:0', '1000k', '-b:a:0', '128k',
      '-var_stream_map', `"v:0,a:0,name:1080p v:1,a:1,name:360p"`,
      '-hls_segment_filename', 'res_%v/file_%v_%03d.ts', 'res_%v/playlist.m3u8',
      '-master_pl_name', 'master.m3u8',
    ]);

    req.pipe(ffmpegProcess.stdin);
    return "ok";
  }
}
