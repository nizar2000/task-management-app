import Link from "next/link";
import { cn } from "@/lib/utils"; // Ensure this utility function is correctly defined
import { buttonVariants } from "@/components/ui/button"; // Ensure this utility function is correctly defined
import { Auth } from "./component/Auth/login"; // Ensure the Auth component is correctly defined
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from "./LanguageSwitcher";

export default function Authentication() {
  const { t } = useTranslation('common'); // Access translations

  return (
    <div className="container relative flex flex-col items-center justify-center min-h-screen md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/Auth/register"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        {t('register')}
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          {t('taskManager')}
        </div>
        
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              {t('testimonial')}
            </p>
            <footer className="text-sm">{t('testimonialAuthor')}</footer>
           
          </blockquote>
          <LanguageSwitcher/>
        </div>
      </div>
      <div className="lg:p-8 flex flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t('login')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('enterEmail')}
            </p>
          </div>
          <Auth />
          <p className="px-8 text-center text-sm text-muted-foreground">
            {t('agreeTo')}{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              {t('termsOfService')}
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              {t('privacyPolicy')}
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
