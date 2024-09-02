import React from 'react';
import Header from '@/components/component/header';
import Dashboard from '@/components/component/dashboard';
import ProtectedRoute from '@/components/component/ProtectedRoute';
import { SideBar } from '@/components/component/sidebar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function DashboardPage() {
  const { t } = useTranslation('common');

  return (
    <>
      <Header />
      <main className={'mx-auto  '}>
      <div className="flex">
        <div className={'w-full max-h-full md:w-2/12 border mr-2 rounded-l'}>
            <SideBar />
          </div>
       

          <div className={'w-full md:w-10/12 border rounded-l'}>
            <Dashboard />
          </div>
        </div>
      </main>
    </>
  );
}



export default ProtectedRoute(DashboardPage);
export async function getServerSideProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
    },
  };
}