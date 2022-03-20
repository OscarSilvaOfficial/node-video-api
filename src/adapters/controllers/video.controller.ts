import fs from 'fs';
import { Request, Response } from 'express';

export class VideoController {
  ChunkSize: number;
  filePath: string;
  videoSize: number;

  constructor() {
    this.ChunkSize = 10 ** 3;
    this.filePath = 'files/test.mp4';
    this.videoSize = fs.statSync(this.filePath).size;
  }

  formatBytes(bytes: number, decimals = 3) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  getResponseHeaders(start: number, end: number) {
    return {
      'Content-Range': `bytes ${start}-${end}/${this.videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Type': 'video/mp4',
    };
  }

  startStreamProcess(filePath: string, start: number, end: number, data: any) {
    console.log({
      start: this.formatBytes(start),
      end: this.formatBytes(end),
    });
    const videoStream = fs.createReadStream(filePath, { start, end });
    videoStream.pipe(data);
  }

  getVideo(req: Request, res: Response) {
    const range = req.headers.range || '0';
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + this.ChunkSize, this.videoSize - 1);

    const headers = this.getResponseHeaders(start, end);
    res.writeHead(206, headers);

    this.startStreamProcess(this.filePath, start, end, res);
  }
}
