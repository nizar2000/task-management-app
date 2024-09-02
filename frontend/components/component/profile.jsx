import { useAuth } from '@/context/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'next-i18next';
import { Input}  from '@/components/ui/input'; // Adjust import according to your setup
import { Button } from '@/components/ui/button'; // Adjust import according to your setup
import { LoaderIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  old_password: z.string().optional(),
  new_password: z.string().min(8, 'Password must be at least 8 characters').optional(),
});

export default function ProfileForm() {
  const { user, updateUser} = useAuth();
  const [loading, setLoading] = useState(false); // Ensure loading is accessed correctly
  const { control, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      old_password: '',
      new_password:''
    },
  });
  const { t } = useTranslation('common');

  const onSubmit = async (formData) => {
    
    
    try {
      setLoading(true);
      await updateUser({
        id: parseInt(user.id, 10), // Ensure user.id is available and valid
        name: formData.name,
        email: formData.email,
        old_password: formData.old_password || '',
        new_password: formData.new_password || '',
      });
      alert(t('profile_updating_successfully'));
    } catch (err) { 
      console.error('Update failed:', err);
      if (err.graphQLErrors) {
        err.graphQLErrors.forEach(({ extensions }) => {
          if (extensions.category === 'validation' && extensions.validation) {
            Object.keys(extensions.validation).forEach((key) => {
              setError(key, {
                type: 'manual',
                message: extensions.validation[key][0],
              });
            });
          }
        });
      } else {
        setError('global', {
          type: 'manual',
          message: t('profile_updating_failed'),
        });
      }
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">{t('updateProfile')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <div>
              <label className="text-lg font-medium">{t('name')}</label>
              <Input
                placeholder={t('name')}
                {...field}
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <div>
              <label className="text-lg font-medium">{t('email')}</label>
              <Input
                placeholder={t('email')}
                type="email"
                {...field}
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
          )}
        />
        <Controller
          name="old_password"
          control={control}
          render={({ field }) => (
            <div>
              <label className="text-lg font-medium">{t('oldPassword')}</label>
              <Input
                type="password"
                placeholder={t('oldPassword')}
                {...field}
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.old_password && <p className="text-red-500 text-sm">{errors.old_password.message}</p>}
            </div>
          )}
        />
        <Controller
          name="new_password"
          control={control}
          render={({ field }) => (
            <div>
              <label className="text-lg font-medium">{t('newPassword')}</label>
              <Input
                type="password"
                placeholder={t('newPassword')}
                {...field}
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.new_password && <p className="text-red-500 text-sm">{errors.new_password.message}</p>}
            </div>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <LoaderIcon  className="h-5 w-5 text-white animate-spin" />
          ) : (
            t('updateProfileButton')
          )}
        </Button>
        {errors.global && <p className="text-red-500 mt-4">{t('error')}: {errors.global.message}</p>}
      </form>
    </div>
  );
}
