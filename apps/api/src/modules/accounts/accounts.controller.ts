import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { AccountResponseDto } from '../auth/dto/auth-response.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('me')
  getMe(@CurrentUser() user: { accountId: string }): Promise<AccountResponseDto> {
    return this.accountsService.getMe(user.accountId);
  }

  @Patch('me')
  updateMe(
    @CurrentUser() user: { accountId: string },
    @Body() body: UpdateAccountDto,
  ): Promise<AccountResponseDto> {
    return this.accountsService.updateMe(user.accountId, body);
  }
}
