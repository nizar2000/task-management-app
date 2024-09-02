import { useLazyQuery,} from "@apollo/client";
import { GET_TASKS } from "@/graphql/queries";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from 'next-i18next';
import Link from "next/link";
import Loading from "../loading";
import { useEffect } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation('common');


  const [getTasks, { loading, error, data }] = useLazyQuery(GET_TASKS, {
    variables: { user_id: parseInt(user.id) },
  });
  useEffect(() => {
    if (user.id) {
      getTasks(); // Trigger the fetch
    }
  }, [user.id, getTasks]);
  if (loading) return <Loading/>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  // Get the top 3 upcoming deadlines
  const topTasks = data?.tasks
  .filter(task => new Date(task.due_date) > new Date()) // Filter out past tasks
  .sort((a, b) => new Date(a.due_date) - new Date(b.due_date)) // Sort by due_date
  .slice(0, 3); 

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <main className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="col-span-1 md:col-span-2 grid gap-6">
          <Card className="bg-white shadow-md rounded-lg p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-2">
                {t('taskManager')}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {t('overview')} 
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-500 text-white rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold">{data?.tasks.filter(task => task.status === "completed").length}</div>
                  <div className="text-sm">{t('Completed')}</div>
                </div>
                <div className="bg-yellow-500 text-white rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold">{data?.tasks.filter(task => task.status === "inProgress").length}</div>
                  <div className="text-sm">{t('In Progress')}</div>
                </div>
                <div className="bg-red-500 text-white rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold">{data?.tasks.filter(task => task.status === "pending").length}</div>
                  <div className="text-sm">{t('Pending')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md rounded-lg p-6">
  <CardHeader>
    <CardTitle className="text-xl font-bold">{t('upcoming_deadlines')}</CardTitle>
    <CardDescription className="text-gray-600">{t('upcoming_deadlines_description')}</CardDescription>
  </CardHeader>
  <CardContent>
  {topTasks && topTasks.length > 0 ? (
          <div className="space-y-4">
        {topTasks.map(task => (
          <div key={task.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-md">
            <div>
              <div className="font-medium text-lg">{task.title}</div>
              <div className="text-sm text-gray-500">
                {t('due_in_days', { days: Math.ceil((new Date(task.due_date) - new Date()) / (1000 * 60 * 60 * 24)) })}
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Link href="/Task/allTasks">
                {t('view')}
              </Link>
            </Button>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center text-gray-500">
        {t('no_upcoming_deadlines')}
      </div>
    )}
  </CardContent>
</Card>

        </div>
      <div className="col-span-1 h-6 grid gap-1">
          <Card className="bg-white shadow-md rounded-lg p-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{t('calendar')}</CardTitle>
              <CardDescription className="text-gray-600">{t('calendar_description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar numberOfMonths={1} className="p-0 [&_td]:w-10 [&_td]:h-10 [&_th]:w-10 [&_[name=day]]:w-10 [&_[name=day]]:h-10 [&>div]:space-x-0 [&>div]:gap-6" />
            </CardContent>
          </Card>
          
        </div>
      </main>
    </div>
  );
}
function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}


function ClipboardIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  )
}


function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}





function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}



