import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from './auth.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private cfg: ConfigService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    if (dto.username) {
      const existingUsername = await this.usersService.findByUsername(dto.username);
      if (existingUsername) throw new ConflictException('Username already in use');
    }

    const hashed = await argon2.hash(dto.password);
    const user = await this.usersService.create({ ...dto, password: hashed });

    // Send welcome email asynchronously
    this.mailService.sendWelcomeEmail(user.email, user.firstName).catch((err) => {
      console.error('Failed to send welcome email in background', err);
    });

    return this.generateTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Check if account is locked
    if (user.lockedUntil && new Date() < user.lockedUntil) {
      const minutesLeft = Math.ceil((user.lockedUntil.getTime() - new Date().getTime()) / 60000);
      throw new UnauthorizedException(`Account is locked. Try again in ${minutesLeft} minutes.`);
    }

    const valid = await argon2.verify(user.password, dto.password);
    
    if (!valid) {
      // Handle failed login attempt
      const attempts = (user.failedLoginAttempts || 0) + 1;
      let lockedUntil = null;
      
      // Lock account after 5 failed attempts for 15 minutes
      if (attempts >= 5) {
        lockedUntil = new Date();
        lockedUntil.setMinutes(lockedUntil.getMinutes() + 15);
      }
      
      await this.usersService.updateLockout(user.id, attempts, lockedUntil);
      
      if (lockedUntil) {
        throw new UnauthorizedException('Too many failed attempts. Account locked for 15 minutes.');
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset lockout on successful login
    if (user.failedLoginAttempts > 0) {
      await this.usersService.updateLockout(user.id, 0, null);
    }

    return this.generateTokens(user);
  }

  async refresh(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.cfg.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UnauthorizedException();
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.usersService.clearRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }

  private generateTokens(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.cfg.get<string>('JWT_SECRET'),
      expiresIn: this.cfg.get<string>('JWT_EXPIRY') || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.cfg.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.cfg.get<string>('JWT_REFRESH_EXPIRY') || '7d',
    });

    return { accessToken, refreshToken, user };
  }
}
