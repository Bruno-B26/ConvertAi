import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';

class UpdateAccountSettingsDto {
  @IsOptional()
  @IsBoolean()
  whatsappConnected?: boolean;

  @IsOptional()
  @IsString()
  whatsappPhone?: string | null;

  @IsOptional()
  @IsString()
  whatsappQrCode?: string | null;
}

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAccountSettingsDto)
  settings?: UpdateAccountSettingsDto;
}
