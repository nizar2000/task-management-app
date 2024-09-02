import Profile from '@/components/component/profile'
import React from 'react'
import Header from '@/components/component/header'
import ProtectedRoute from '@/components/component/ProtectedRoute';
import { SideBar } from '@/components/component/sidebar';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function profile() {
  return (
    <>
    <Header />
    <main className={'mx-auto  '}>
      <div className="flex">
        <div className={'w-full max-h-full md:w-2/12 border mr-2 rounded-l'}>
          <SideBar />
        </div>
        <div className={'w-full md:w-10/12 border rounded-l'}>
        <Profile />

        </div>
      </div>
    </main>

  

          

     
    

  </>
  )
}

export default ProtectedRoute(profile);
export async function getServerSideProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
    },
  };
}