import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Button } from '../components/ui/button';
import { DELETE_REMINDER } from '../graphql/mutations';
import { GET_REMINDERS } from '../graphql/queries';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from '@radix-ui/react-dropdown-menu';
import { useTranslation } from 'next-i18next';
import { useAuth } from '@/context/AuthContext';
import { TimerIcon } from 'lucide-react';
import Loading from './loading';

const Reminders = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [getReminders, { data, loading: queryLoading, error: queryError }] = useLazyQuery(GET_REMINDERS, {
    variables: { user_id: parseInt(user?.id) },
    pollInterval: 60000,
  });

  useEffect(() => {
    if (user.id) {
      getReminders(); // Trigger the fetch
    }
  }, [user.id, getReminders]);

  const [deleteReminder] = useMutation(DELETE_REMINDER, {
    onError: (error) => {
      console.error("Error deleting REMINDERS:", error);
    },
  });

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteReminder({
        variables: { id: parseInt(id) },
        update: (cache) => {
          try {
            const existingReminders = cache.readQuery({ query: GET_REMINDERS, variables: { user_id: user.id } });
            if (existingReminders && existingReminders.reminders) {
              const newReminders = existingReminders.reminders.filter(reminder => reminder.id !== id);
              cache.writeQuery({
                query: GET_REMINDERS,
                data: { reminders: newReminders },
                variables: { user_id: user.id }
              });
            } else {
              console.error("No reminder found in cache");
            }
          } catch (readError) {
            console.error("Error reading reminders from cache:", readError);
          }
        }
      });
      alert(t('reminderDeleted'));
    } catch (err) {
      console.error("Error deleting reminder:", err);
    } finally {
      setLoading(false);
    }
  };

  const { t } = useTranslation('common');

  if (queryLoading) return <Loading />;
  if (queryError) return <p>{t('error')}: {queryError.message}</p>;

  // Ensure data and data.reminders are defined
  const reminders = data?.reminders || [];
  
  // Sort reminders by time in descending order
  const sortedReminders = reminders.slice().sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('reminders')}</h1>

      {sortedReminders.length > 0 ? (
        sortedReminders.map((reminder) => (
          <Card key={reminder.id}>
            <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
              <div className="space-y-1">
                <CardTitle>{reminder.message}</CardTitle>
                <CardDescription>{reminder.task.title}</CardDescription>
              </div>
              <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
                <Separator orientation="vertical" className="h-[20px]" />
                <Button
                  onClick={() => handleDelete(reminder.id)}
                  variant="outline"
                  className="ml-2"
                >
                  {t('delete')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <TimerIcon className="mr-1 h-4 w-4" />
                  {reminder.time}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>{t('noReminders')}</p>
      )}
    </div>
  );
};

export default Reminders;
