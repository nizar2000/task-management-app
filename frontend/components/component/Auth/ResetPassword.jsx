import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD } from '@/graphql/mutations';
import { useTranslation } from 'next-i18next';

export default function PasswordReset() {
  const router = useRouter();
  const { token } = router.query;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [resetPassword, { data, loading, error }] = useMutation(RESET_PASSWORD);
  const { t } = useTranslation('common');

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await resetPassword({
        variables: { email, password, password_confirmation: passwordConfirmation, token },
      });
      if (response.data.resetPassword.success) {
        setMessage({ type: 'success', text: t('passwordResetSuccess') });
        router.push('/Auth/login');
      } else {
        setMessage({ type: 'error', text: response.data.resetPassword.message });
      }
    } catch (err) {
      if (err.networkError) {
        setMessage({ type: 'error', text: t('networkError') });
      } else if (err.graphQLErrors) {
        const errorMessage = err.graphQLErrors[0]?.message || t('unknownError');
        setMessage({ type: 'error', text: errorMessage });
      } else {
        setMessage({ type: 'error', text: t('unknownError') });
      }
    }
  };

  return (
    <div className="mx-auto  w-96 h-auto space-y-8 bg-background p-6 rounded-lg shadow-lg">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">{t('resetPasswordTitle')}</h1>
        <p className="text-muted-foreground">{t('enterDetails')}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-medium">
              {t('emailLabel')}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-md border-input focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-medium">
              {t('newPasswordLabel')}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={t('newPasswordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-md border-input focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordConfirmation" className="font-medium">
              {t('confirmNewPasswordLabel')}
            </Label>
            <Input
              id="passwordConfirmation"
              type="password"
              placeholder={t('confirmNewPasswordPlaceholder')}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              className="rounded-md border-input focus:border-primary focus:ring-primary"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-slate-800 text-white hover:bg-primary/90 focus:ring-primary"
          >
            {loading ? t('sending') : t('resetPasswordButton')}
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-md border-input hover:bg-accent hover:text-accent-foreground"
          >
            <Link href="/Auth/login">
              {t('return')}
            </Link>
          </Button>
        </div>
        
      </form>
      {message.text && (
        <p className={`mt-4 font-medium text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
