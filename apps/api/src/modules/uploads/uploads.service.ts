import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor(private cfg: ConfigService) {
    const cloudinaryUrl = this.cfg.get<string>('CLOUDINARY_URL');
    if (cloudinaryUrl) {
      cloudinary.config(true);
    } else {
      this.logger.warn('CLOUDINARY_URL is not set. Uploads will fail.');
    }

    // Ensure local upload dir exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'mos-platform'): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const cloudinaryUrl = this.cfg.get<string>('CLOUDINARY_URL');
    
    // If Cloudinary is configured, use it
    if (cloudinaryUrl) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) return reject(new BadRequestException('Cloudinary upload failed: ' + error.message));
            if (!result) return reject(new BadRequestException('Cloudinary upload returned no result'));
            resolve({ url: result.secure_url });
          }
        );
        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
      });
    }

    // Fallback to local
    const ext = path.extname(file.originalname) || '.bin';
    const filename = `${uuidv4()}${ext}`;
    const filepath = path.join(this.uploadDir, filename);
    fs.writeFileSync(filepath, file.buffer);
    
    // Default to render URL if not specified
    const baseUrl = this.cfg.get('API_URL') || 'https://najdawi-platform.onrender.com';
    return { url: `${baseUrl}/api/uploads/${filename}` };
  }
}
