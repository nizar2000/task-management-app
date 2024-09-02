"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from '@apollo/client';
import { UPDATE_TASK } from '@/graphql/mutations';

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
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
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
const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Overdue", label: "Overdue" },
];
export function UpdateTaskForm({ initialValues,values }) {
  const [updateTask, { data, loading, error }] = useMutation(UPDATE_TASK);
  const [successMessage, setSuccessMessage] = useState("");
  const { user } = useAuth();
  const { t } = useTranslation('common'); 
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (formData) => {
    const variables = {
      id: parseInt(initialValues.id), // Convert id to integer
      title: formData.title,
      description: formData.description,
      due_date: formData.due_date,
      priority: formData.priority,
      status: formData.status,
      user_id: parseInt(user.id),
      ...values
    };
  // Access translations

    console.log("Updating task with variables:", variables);
  
    try {
      await updateTask({
        variables,
      });
      setSuccessMessage("Task updated successfully!");
 
      // Optionally handle success (e.g., show a success message or redirect)
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };
  
  const statuses = ['inProgress', 'completed', 'pending'];
  const priorities = ['High', 'Medium', 'Low'];
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Hidden ID Field */}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => ( 
            <FormItem>
              <FormLabel>{t('title')}</FormLabel>
              <FormControl>
                <Input placeholder={t('titlePlaceholder')} {...field} />
              </FormControl>
              <FormDescription>{t('titleDescription')}</FormDescription>
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
                <Input placeholder={t('descriptionPlaceholder')} {...field} />
              </FormControl>
              <FormDescription>{t('descriptionDescription')}</FormDescription>
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
              <FormDescription>{t('dueDateDescription')}</FormDescription>
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
                  {t(status)} 
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
        {successMessage && <p className="text-green-500 mt-2">{t('successMessage')}</p>}
        {error && <p className="text-red-500 mt-2">{t('errorMessage')}{error.message}</p>}
        <Button type="submit" className="bg-slate-500" disabled={loading}>
          {loading ? t('submittingButton') : t('submitButton')}
        </Button>
      </form>
    </Form>
  );
}
