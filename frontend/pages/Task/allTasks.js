// src/pages/index.js

import CardsPage  from '@/components/allTaskspage';
import { SideBar } from '@/components/component/sidebar';
import Header from '@/components/component/header';
import ProtectedRoute from '@/components/component/ProtectedRoute';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
const Home = () => {

  console.log("Current UTC time:", new Date().toISOString());

  return (
    <>    
       <Header />
    <main className={'mx-auto  '}>
      <div className="flex">
        <div className={'w-full max-h-full md:w-2/12 border mr-2 rounded-l'}>
          <SideBar />
        </div>
        <div className={'w-full md:w-10/12 border rounded-l'}>
        
     <CardsPage/>
        </div>
      </div>
    </main>
    </>
  );
};

export default ProtectedRoute(Home);
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'footer'])),
    },
  };
}