import ResetPassword from '@/components/component/Auth/ResetPassword';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function PasswordReset() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <ResetPassword />
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