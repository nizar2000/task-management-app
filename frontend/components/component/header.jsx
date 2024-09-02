import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { GET_DUE_REMINDERS } from '@/graphql/queries';
import { useLazyQuery } from "@apollo/client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import LanguageSwitcher from '../LanguageSwitcher'; // Import the LanguageSwitcher component
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const Header = () => {
  const { t } = useTranslation('common'); // Access translations
  const { user, logout } = useAuth();
  const [userId, setUserId] = useState(null);
  const [getDueReminders, { loading, error, data }] = useLazyQuery(GET_DUE_REMINDERS, {
    variables: { user_id: parseInt(user?.id) },
    pollInterval: 60000,
  });
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setUserId(parseInt(user.id)); 
      getDueReminders();
    } else {
      logout();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const handleViewAllClick = () => {
    router.push('/Reminder/reminders');
  };

  // Ensure data and data.dueReminders are defined
  const dueReminders = data?.dueReminders || [];

  // Sort due reminders by time in descending order
  const sortedReminders = dueReminders.slice().sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <header className="bg-nav sticky h-24 top-0 bg-gray-800 text-white border-b border-gray-700 px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors duration-300">
          {t('taskManager')}
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <FontAwesomeIcon icon={faBell} className="text-xl text-gray-300 hover:text-gray-100 transition-colors duration-300" />
              {sortedReminders.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {sortedReminders.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white text-gray-800 rounded-md shadow-lg ring-1 ring-gray-300">
            {loading ? (
              <DropdownMenuItem>
                <p>{t('loadingReminders')}</p>
              </DropdownMenuItem>
            ) : error ? (
              <DropdownMenuItem>
                <p>{t('errorLoadingReminders')}</p>
              </DropdownMenuItem>
            ) : (
              <>
                {sortedReminders.length > 0 ? (
                  <div className="p-4">
                    <p className="mb-2 font-semibold">{t('youHaveReminders', { count: sortedReminders.length })}</p>
                    <ul className="list-none p-0">
                      {sortedReminders.slice(0, 5).map((reminder) => (
                        <li key={reminder.id} className="border-b border-gray-200 py-2">
                          <strong className="text-gray-800">{reminder.task.title}</strong>: {reminder.message}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 text-center">
                      <Button variant="link" className="text-blue-500 hover:text-blue-600" onClick={handleViewAllClick}>
                        {t('viewAllReminders')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <DropdownMenuItem>
                    <p>{t('noReminders')}</p>
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
          <LanguageSwitcher />
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full relative">
              {user.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white text-gray-800 rounded-md shadow-lg ring-1 ring-gray-300">
            <DropdownMenuItem>
              <Link href="/Auth/profile" className="text-gray-800 hover:text-gray-600">{t('profile')}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-100">
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
