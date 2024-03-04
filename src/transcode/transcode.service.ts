import { Injectable } from '@nestjs/common';
import { exec, spawn } from 'child_process';
import ffmpegCommand from './ffmpeg-command';
import hlsCommand from './hls-command';

@Injectable()
export class TranscodeService {
  constructor() {}

  hls(streamKey: string) {
    return spawn('ffmpeg', hlsCommand(streamKey))
  }
}
