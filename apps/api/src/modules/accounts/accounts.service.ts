import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { AccountResponseDto } from '../auth/dto/auth-response.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountDocument } from './schemas/account.schema';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  constructor(private readonly accountsRepository: AccountsRepository) {}

  async create(name: string): Promise<AccountResponseDto> {
    const slug = this.generateSlug(name);
    const account = await this.accountsRepository.create({ name, slug });
    this.logger.log(`Account created: ${account._id.toString()}`);
    return this.toDto(account);
  }

  async getMe(accountId: string): Promise<AccountResponseDto> {
    const account = await this.accountsRepository.findById(accountId);
    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }
    return this.toDto(account);
  }

  async updateMe(accountId: string, data: UpdateAccountDto): Promise<AccountResponseDto> {
    const account = await this.accountsRepository.updateById(accountId, data);
    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }
    this.logger.log(`Account ${accountId} updated`);
    return this.toDto(account);
  }

  private generateSlug(name: string): string {
    const base = name
      .toLowerCase()
      .normalize('NFD')
      .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return `${base}-${Date.now()}`;
  }

  private toDto(account: AccountDocument): AccountResponseDto {
    return {
      id: account._id.toString(),
      name: account.name,
      slug: account.slug,
      plan: account.plan,
      status: account.status,
      settings: account.settings,
      createdAt: account.createdAt,
    };
  }
}
