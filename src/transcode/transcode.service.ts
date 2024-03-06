import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import hlsCommand from './hls-command';

@Injectable()
export class TranscodeService {
  constructor() {}

  // 미사용 (테스트 필요)
  hls(streamKey: string) {
    return spawn('ffmpeg', hlsCommand(streamKey))
  }
}
