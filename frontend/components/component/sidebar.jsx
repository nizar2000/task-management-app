import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button.jsx";
import { LayoutDashboardIcon, ReceiptTextIcon } from "lucide-react";
import Link from "next/link";
import { useTranslation } from 'next-i18next';

export function SideBar({ className }) {
  const { t } = useTranslation('common'); // Access translations

  return (
    <div className={cn("flex flex-col fixed w-56 p-4 h-screen bg-gray-800 text-white", className)}>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 px-4 py-2 bg-gray-700 rounded-md shadow-md">
          {t('dashboard')}
        </h2>
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            <LayoutDashboardIcon className="w-5 h-5 text-gray-400" />
            <Link href="/dashboard" className="text-gray-300 hover:text-white" locale="en">
              {t('dashboard')}
            </Link>
          </Button>

          <Button
            variant="ghost"
            className="w-full flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            <ReceiptTextIcon className="w-5 h-5 text-gray-400" />
            <Link href="/Task/allTasks" className="text-gray-300 hover:text-white">
              {t('allTasks')}
            </Link>
          </Button>

      
      

       
        </div>
      </div>
    </div>
  );
}
