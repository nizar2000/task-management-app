import Link from "next/link";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslation } from 'next-i18next';
import { useAuth } from '@/context/AuthContext'; // Adjust the import path as needed
import { useRouter } from 'next/navigation';

export default function Landing() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user, authenticated } = useAuth();
  const handleDashboardRedirect = () => {
    router.push('/dashboard');
  };
  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50 text-gray-900">
      <header className="px-4 lg:px-6 h-32 flex items-center bg-slate-800 text-white">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <span className="self-center text-2xl font-bold whitespace-nowrap">{t('taskManager')}</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <LanguageSwitcher />
          <div className="flex items-center space-x-4">
      {authenticated ? (
        <>
          <span className="text-white-800 font-medium">Welcome, {user?.name}!</span>
          <button
            onClick={handleDashboardRedirect}
            className="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 focus:ring-slate-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none"
          >
            {t('dashboard')}
          </button>
        </>
      ) : (
        <>
          <Link
            href="/Auth/register"
            className="text-slate-800 bg-white border-slate-800 hover:bg-slate-800 hover:text-white focus:ring-4 focus:ring-slate-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none"
            prefetch={false}
          >
            {t('register')}
          </Link>
          <Link
            href="/Auth/login"
            className="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 focus:ring-slate-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none"
            prefetch={false}
          >
            {t('login')}
          </Link>
        </>
      )}
    </div>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-16 md:py-32 lg:py-48 bg-gradient-to-r from-slate-100 to-slate-300">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_450px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl text-slate-900">
                    {t('revolutionize_workflow')}
                  </h1>
                  <p className="max-w-[700px] text-gray-700 md:text-xl">
                    {t('manage_tasks')}
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Link
                    href="/dashboard"
                    className="inline-flex h-12 w-28 items-center justify-center rounded-md bg-slate-600 text-lg font-semibold text-white shadow-lg hover:bg-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                    {t('try_it_now')}
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-12 items-center justify-center rounded-md border border-gray-300 bg-gray-50 text-gray-900 px-8 text-lg font-semibold shadow-lg transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300">
                    {t('learn_more')}
                  </Link>
                </div>
              </div>
              <img
                src="/task.png"
                width="550"
                height="550"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-2xl object-cover sm:w-full lg:order-last lg:aspect-square" />
            </div>
          </div>
        </section>
        <section className="w-full py-16 md:py-32 lg:py-48 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-slate-600 px-4 py-2 text-sm text-white">{t('key_features')}</div>
                <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-slate-900">{t('unlock_potential')}</h2>
                <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t('discover_features')}
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-6">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-2">
                      <h3 className="text-2xl font-bold text-slate-900">{t('intuitive_task_creation')}</h3>
                      <p className="text-gray-600">
                        {t('intuitive_task_creation_description')}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-2">
                      <h3 className="text-2xl font-bold text-slate-900">{t('advanced_progress_tracking')}</h3>
                      <p className="text-gray-600">
                        {t('advanced_progress_tracking_description')}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-2">
                      <h3 className="text-2xl font-bold text-slate-900">{t('customizable_views')}</h3>
                      <p className="text-gray-600">
                        {t('customizable_views_description')}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <img
                src="/1.png"
                width="550"
                height="310"
                alt="App Interface"
                className="mx-auto aspect-video overflow-hidden rounded-2xl object-cover object-center sm:w-full lg:order-last" />
            </div>
          </div>
        </section>
        <section className="w-full py-16 md:py-32 lg:py-48 bg-slate-800">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <img
              src="/indiv.png"
              width="550"
              height="310"
              alt="Advanced Features"
              className="mx-auto aspect-video overflow-hidden rounded-2xl object-cover object-center sm:w-full" />
            <div className="space-y-4 text-white">
              <div className="inline-block rounded-lg bg-slate-600 px-4 py-2 text-sm text-white">{t('advanced_features')}</div>
              <h2 className="text-4xl font-bold tracking-tighter md:text-5xl text-white">{t('stay_on_top')}</h2>
              <p className="max-w-[600px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t('manage_efficiency')}
              </p>
              <div className="flex flex-col gap-4 min-[400px]:flex-row">
                <Link
                  href="#"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-slate-600 px-8 text-lg font-semibold text-white shadow-lg hover:bg-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                  {t('try_it_now')}
                </Link>
                <Link
                  href="#"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-gray-300 bg-gray-50 px-8 text-lg font-semibold text-gray-900 shadow-lg transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300">
                  {t('learn_more')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-200 bg-gray-800">
        <p className="text-xs text-gray-400">&copy; 2024 Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
}
