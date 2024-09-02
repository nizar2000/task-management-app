// pages/[locale]/index.js
import Landing from '@/components/component/landing';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function HomePage() {
  return (
    <Landing/>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'footer'])),
    },
  };
}