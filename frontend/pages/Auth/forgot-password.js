import Auth  from '@/components/component/Auth/RequestPasswordReset';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Auth />
        </div>
    );
}
export async function getServerSideProps(context) {
    return {
      props: {
        ...(await serverSideTranslations(context.locale, ['common'])),
      },
    };
  }