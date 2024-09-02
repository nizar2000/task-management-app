import React from 'react';
import AuthenticationPage from '@/components/registerPage';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AuthenticatedRoute from '@/components/component/AuthenticatedRoute';

const register = () => {
  return (
    <div>
<AuthenticationPage/>

    </div>
  );
};

export default AuthenticatedRoute(register);
export async function getServerSideProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
    },
  };
}