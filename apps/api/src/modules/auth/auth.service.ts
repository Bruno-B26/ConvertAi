import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { N8nWebhookService } from '@common/n8n/n8n-webhook.service';
import { AccountsService } from '../accounts/accounts.service';
import { UsersService, UserRecord } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthResponseDto, UserResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly accountsService: AccountsService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly n8nWebhookService: N8nWebhookService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    await this.usersService.ensureEmailAvailable(dto.email);

    const account = await this.accountsService.create(dto.name);

    const user = await this.usersService.create({
      accountId: account.id,
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: 'owner',
    });

    this.logger.log(`Novo usuário registrado: ${user.email}`);

    const accessToken = this.signToken(user.id, user.accountId, user.email);

    return {
      accessToken,
      user: this.toUserDto(user),
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.validateCredentials(dto.email, dto.password);

    const accessToken = this.signToken(user.id, user.accountId, user.email);

    return {
      accessToken,
      user: this.toUserDto(user),
    };
  }

  async getMe(userId: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(userId);
    return this.toUserDto(user);
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const resetRequest = await this.usersService.requestPasswordReset(dto.email);

    if (resetRequest) {
      const frontendUrl = this.configService.get<string>('corsOrigin');
      const resetUrl = `${frontendUrl}/reset-password?token=${resetRequest.token}`;

      await this.n8nWebhookService.dispatch(
        this.configService.get<string>('n8n.passwordResetWebhookUrl'),
        { email: dto.email, name: resetRequest.name, resetUrl },
      );
    }

    return {
      message: 'Se o email existir em nossa base, você receberá instruções de recuperação.',
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    await this.usersService.resetPassword(dto.token, dto.newPassword);
    return { message: 'Senha redefinida com sucesso.' };
  }

  private signToken(userId: string, accountId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, accountId, email });
  }

  private toUserDto(user: UserRecord): UserResponseDto {
    return { ...user };
  }
}
