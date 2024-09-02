import React from 'react';
import Authentication from '@/components/loginPage';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AuthenticatedRoute from '@/components/component/AuthenticatedRoute';

const login = () => {
  return (
    <div>
 
      <Authentication />
    </div>
  );
};

export default AuthenticatedRoute(login);
export async function getServerSideProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
    },
  };
}