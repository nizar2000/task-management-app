"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from '@apollo/client';
import { CREATE_TASK } from '@/graphql/mutations';
import { GET_TASKS } from "@/graphql/queries";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.jsx";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'next-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  due_date: z.string().nonempty({
    message: "Due date is required.",
  }),
  priority: z.string().nonempty({
    message: "Priority is required.",
  }),
  status: z.string().nonempty({
    message: "Status is required.",
  }),
});

export function NewTaskForm({ onClose, values }) {
  const [createTask, { loading, error }] = useMutation(CREATE_TASK);
  const { user } = useAuth();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      due_date: "",
      priority: "",
      status: "",
      ...values
    },
  });
  const { t } = useTranslation('common'); // Access translations

  const onSubmit = async (formData) => {
    const variables = {
      user_id: parseInt(user.id),
      title: formData.title,
      description: formData.description,
      due_date: formData.due_date,
      priority: formData.priority,
      status: formData.status,
      ...values
    };

    console.log("Creating task with variables:", variables);

    try {
      await createTask({
        variables,
        update: (cache, { data: { createTask } }) => {
          const existingTasksData = cache.readQuery({ query: GET_TASKS });
          const existingTasks = existingTasksData ? existingTasksData.tasks : [];

          cache.writeQuery({
            query: GET_TASKS, 
            data: {
              tasks: [
                ...existingTasks,
                { ...createTask, user_id: parseInt(user.id) },
              ],
            },
          });
        },
      });

      alert("Task created successfully!");
      form.reset();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };
 
  const statuses = ['inProgress', 'completed', 'pending'];
  const priorities = ['High', 'Medium', 'Low'];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('title')}</FormLabel>
              <FormControl>
                <Input placeholder={t('taskTitlePlaceholder')} {...field} />
              </FormControl>
              <FormDescription>
                {t('titleDescription')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('description')}</FormLabel>
              <FormControl>
                <Input placeholder={t('taskDescriptionPlaceholder')} {...field} />
              </FormControl>
              <FormDescription>
                {t('descriptionDescription')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('dueDate')}</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                {t('dueDateDescription')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> 
    <FormField
      control={form.control}
      name="priority"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('priority')}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t('priority')} {...field} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-slate-600 text-white">
              {priorities.map((priority) => (
                <SelectItem
                  key={priority}
                  value={priority}
                  className="bg-slate-800 hover:bg-slate-700"
                >
                  {t(priority)} {/* Apply translation */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
       
       <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('status')}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t('status')} {...field} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-slate-600 text-white">
              {statuses.map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                  className="bg-slate-800 hover:bg-slate-700"
                >
                  {t(status)} {/* Apply translation */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
        <Button type="submit" className="bg-slate-500" disabled={loading}>
          {loading ? t('submitting') : t('submit')}
        </Button>
        {error && <p>{t('error', { error: error.message })}</p>}
      </form>
    </Form>
  );
}
