import { ChevronDownIcon, CircleIcon, PlusIcon, StarIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Separator } from "@/components/ui/separator";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_TASKS } from "@/graphql/queries";
import { DELETE_TASK, CREATE_TASK, MARK_TASK_AS_COMPLETE } from '@/graphql/mutations'; // Import new mutation
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../ui/sheet";
import { NewTaskForm } from "./NewTaskForm";
import { UpdateTaskForm } from "./UpdateTaskForm";
import ReminderModal from "../Reminder/ReminderModal";
import { useAuth } from "@/context/AuthContext";
import { AlignJustifyIcon, FilePenLineIcon,  TimerIcon, Trash2Icon, XIcon } from "lucide-react";
import { useTranslation } from 'next-i18next';
import Loading from "@/components/loading";


export const DemoCard = () => {
  const [isReminderModalOpen, setReminderModalOpen] = useState(false);
  const [selectedTaskForReminder, setSelectedTaskForReminder] = useState(null);
  const { user } = useAuth();
  const { t } = useTranslation('common'); 

  const [statusColors, setStatusColors] = useState({});

  useEffect(() => {
    setStatusColors({
      [t('pending')]: "bg-yellow-300",
      [t('inProgress')]: "bg-blue-300",
      [t('completed')]: "bg-green-300",
    });
  }, [t]);
  
  const closeReminderModal = () => {
    setReminderModalOpen(false);
    setSelectedTaskForReminder(null);
  };

  const [getTasks, { loading: queryLoading, error, data }] = useLazyQuery(GET_TASKS, {
    variables: { user_id: parseInt(user.id) },
  });
  
  // Trigger the lazy query when the component mounts or when the user.id changes
  useEffect(() => {
    if (user.id) {
      getTasks(); // Trigger the fetch
    }
  }, [user.id, getTasks]);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [deleteTask] = useMutation(DELETE_TASK, {
    onError: (error) => {
      console.error("Error deleting task:", error);
    },
  });



  const [markTaskAsComplete] = useMutation(MARK_TASK_AS_COMPLETE, {
    update(cache, { data: { markTaskAsComplete } }) {
      const existingTasks = cache.readQuery({ query: GET_TASKS, variables: { user_id: user.id } });
      const newTasks = existingTasks.tasks.map(task =>
        task.id === markTaskAsComplete.id ? { ...task, status: t('completed') } : task
      );
      cache.writeQuery({
        query: GET_TASKS,
        data: { tasks: newTasks },
        variables: { user_id: user.id }
      });
    },
    onError: (error) => {
      console.error("Error marking task as complete:", error);
    },
  });

  const openReminderModal = (task) => {
    setSelectedTaskForReminder(task);
    setReminderModalOpen(true);
  };

  const handleOpenForm = () => {
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
  };

  if (queryLoading || loading) return <Loading/>;
  if (error) return <p className="text-center text-red-600">{t('error', { message: error.message })}</p>;

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteTask({
        variables: { id: parseInt(id) },
        update: (cache) => {
          try {
            const existingTasks = cache.readQuery({ query: GET_TASKS, variables: { user_id: user.id } });
            if (existingTasks && existingTasks.tasks) {
              const newTasks = existingTasks.tasks.filter(task => task.id !== id);
              cache.writeQuery({
                query: GET_TASKS,
                data: { tasks: newTasks },
                variables: { user_id: user.id }
              });
            } else {
              console.error("No tasks found in cache");
            }
          } catch (readError) {
            console.error("Error reading tasks from cache:", readError);
          }
        }
      });
      alert(t('taskDeleted'));
    } catch (err) {
      console.error("Error deleting task:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleMarkAsComplete = async (id) => {
    setLoading(true);
    try {
      await markTaskAsComplete({
        variables: { id: parseInt(id) },
      });
      alert(t('taskCompleted'));
    } catch (err) {
      console.error("Error marking task as complete:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = (data?.tasks || [])
    .filter(task =>
      (priorityFilter ? task.priority === priorityFilter : true) &&
      (statusFilter ? task.status === statusFilter : true) &&
      (task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date)); // Sort by due_date

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center ">
          <h2 className="text-2xl font-bold tracking-tight">{t('welcomeBack')}</h2>
          <Button onClick={handleOpenForm} className="bg-blue-500 text-white hover:bg-blue-600 transition-colors">
            {t('newTask')}
          </Button>
        </div>

        {isFormVisible && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-h-[100vh] w-full max-w-md relative overflow-y-auto">
              <button 
                onClick={handleCloseForm}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <XIcon className="h-6 w-6" />
              </button>
              <NewTaskForm onClose={handleCloseForm} />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-row items-center space-x-4">
        <div>
          <input
            type="text"
            placeholder={t('searchTasks')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md p-2 pl-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="priorityFilter" className="block text-gray-700">{t('filterByPriority')}</label>
          <select
            id="priorityFilter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full max-w-md p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">{t('all')}</option>
            <option value="High">{t('High')}</option>
            <option value="Medium">{t('Medium')}</option>
            <option value="Low">{t('Low')}</option>
          </select>
        </div>

              <div className="mb-4">
          <label htmlFor="statusFilter" className="block text-gray-700">{t('filterByStatus')}</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full max-w-md p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">{t('all')}</option>
            <option value="completed">{t('completed')}</option>
            <option value="pending">{t('pending')}</option>
            <option value="inProgress">{t('inProgress')}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTasks.map((task) => (
        <Card key={task.id} className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
              <CardDescription className="text-gray-600">{task.description}</CardDescription>
            </div>
            <div className="flex items-center space-x-2 bg-gray-100 rounded-md">
            <Button 
      variant="secondary" 
      className={`px-3 py-1 text-sm ${statusColors[t(task.status)] || 'bg-gray-200'}`}
    >
      {t(task.status)}
    </Button>
              <Separator orientation="vertical" className="h-[20px]" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="px-2 py-1 mr-10">
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent  align="start" className="w-48 text-white bg-slate-800 hover:bg-slate-700">
                  <DropdownMenuLabel>{t('taskActions')}</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleEditClick(task)}>
                    <FilePenLineIcon className="mr-2 h-4 w-4" /> {t('edit')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(task.id)}>
                    <Trash2Icon className="mr-2 h-4 w-4" /> {t('delete')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openReminderModal(task)} >
                    <PlusIcon className="mr-2 h-4 w-4" /> {t('addReminder')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMarkAsComplete(task.id)} >
                    <CircleIcon className="mr-2 h-4 w-4" /> {t('markAsComplete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <AlignJustifyIcon className="mr-1 h-4 w-4" />
                {t(task.priority)}
              </div>
              <div className="flex items-center">
                <TimerIcon className="mr-1 h-4 w-4" />
                {task.due_date}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{t('editTask')}</SheetTitle>
          </SheetHeader>
          {selectedTask && <UpdateTaskForm initialValues={selectedTask} />}
        </SheetContent>
      </Sheet>
    
      {selectedTaskForReminder && (
        <ReminderModal
          open={isReminderModalOpen}
          onOpenChange={setReminderModalOpen}
          taskId={selectedTaskForReminder.id}
          onClose={closeReminderModal}
        />
      )}
    </>
  );
};
