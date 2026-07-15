import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { Types } from 'mongoose';
import { UsersRepository } from './users.repository';
import { UserDocument } from './schemas/user.schema';

export interface UserRecord {
  id: string;
  accountId: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

export interface PasswordResetRequest {
  token: string;
  name: string;
}

const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async ensureEmailAvailable(email: string): Promise<void> {
    const existing = await this.usersRepository.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email já cadastrado');
    }
  }

  async create(data: {
    accountId: string;
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<UserRecord> {
    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await this.usersRepository.create({
      accountId: new Types.ObjectId(data.accountId),
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
    });

    this.logger.log(`Novo usuário registrado: ${user.email}`);
    return this.toRecord(user);
  }

  async validateCredentials(email: string, password: string): Promise<UserRecord> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    await this.usersRepository.updateLastLogin(user._id.toString());

    return this.toRecord(user);
  }

  async findById(id: string): Promise<UserRecord> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return this.toRecord(user);
  }

  async requestPasswordReset(email: string): Promise<PasswordResetRequest | null> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);

    await this.usersRepository.setPasswordResetToken(
      user._id.toString(),
      this.hashToken(token),
      expiresAt,
    );

    return { token, name: user.name };
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usersRepository.findByValidResetToken(this.hashToken(token));
    if (!user) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.usersRepository.resetPassword(user._id.toString(), passwordHash);
    this.logger.log(`Senha redefinida para o usuário ${user.email}`);
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private toRecord(user: UserDocument): UserRecord {
    return {
      id: user._id.toString(),
      accountId: user.accountId.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
