export class UserResponseDto {
  id: string;
  accountId: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

export class AuthResponseDto {
  accessToken: string;
  user: UserResponseDto;
}

export class AccountResponseDto {
  id: string;
  name: string;
  slug: string;
  plan: string;
  status: string;
  settings: {
    whatsappConnected: boolean;
    whatsappPhone: string | null;
    whatsappQrCode: string | null;
  };
  createdAt: Date;
}
