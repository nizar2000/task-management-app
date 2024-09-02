// components/ReminderModal.js
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";

import { Input } from '@/components/ui/input';
import { ADD_REMINDER } from '@/graphql/mutations';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'next-i18next';
import { GET_REMINDERS } from '@/graphql/queries';
import { Dialog, DialogOverlay, DialogContent, DialogTitle } from "@radix-ui/react-dialog";


const ReminderModal = ({ taskId, onClose }) => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [time, setTime] = useState('');
  const [addReminder] = useMutation(ADD_REMINDER);
  const { user } = useAuth();
  const { t } = useTranslation('common'); // Access translations

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReminder({
        variables: {
          task_id: parseInt(taskId), // Convert to integer if necessary
          message,
          time,
          user_id: parseInt(user.id), // Convert to integer if necessary
        }, update: (cache, { data: { addReminder } }) => {
          const existingRemindersData = cache.readQuery({ query: GET_REMINDERS  });
          const existingReminders = existingRemindersData ? existingRemindersData.reminders : [];

          cache.writeQuery({
            query: GET_REMINDERS, 
            data: {
              reminders: [
                ...existingReminders,
                { ...addReminder, user_id: parseInt(user.id) },
              ],
            },
          });
        },
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onClose) {
          onClose();
        }
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
      <DialogContent className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            &times;
          </button>
          <DialogTitle asChild>
            <h2 className="text-2xl font-bold mb-4 text-center">{t('addReminder')}</h2>
          </DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="message">{t('reminderMessage')}</Label>
              <Input
                id="message"
                type="text"
                placeholder={t('reminderMessage')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <Label htmlFor="time">{t('reminderTime')}</Label>
              <Input
                id="time"
                type="datetime-local"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
                {t('addReminderButton')}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
              >
                {t('closeButton')}
              </Button>
            </div>
          </form>
          {success && <p className="mt-4 text-green-500 text-center">{t('reminderSuccess')}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderModal;
