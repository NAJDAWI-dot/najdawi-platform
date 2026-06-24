import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import * as sanitizeHtml from 'sanitize-html';

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'object' || value === null) {
      if (typeof value === 'string') {
        return this.cleanString(value);
      }
      return value;
    }

    return this.cleanObject(value);
  }

  private cleanObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.cleanObject(item));
    }

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'string') {
          obj[key] = this.cleanString(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          obj[key] = this.cleanObject(obj[key]);
        }
      }
    }
    return obj;
  }

  private cleanString(str: string): string {
    // Trim whitespaces
    const trimmed = str.trim();
    // Strip malicious scripts but allow safe text
    return sanitizeHtml(trimmed, {
      allowedTags: [], // Strip ALL HTML tags to prevent XSS (if you need rich text later, add allowed tags here)
      allowedAttributes: {},
    });
  }
}
