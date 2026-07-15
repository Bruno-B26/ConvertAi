import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export const metadata = { title: 'Redefinir senha — ConvertAI' };

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;
  return <ResetPasswordForm token={token ?? ''} />;
}
