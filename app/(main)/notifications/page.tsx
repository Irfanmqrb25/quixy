import NotificationClient from "./client";

import getCurrentUser from "@/actions/getCurrentUser";
import { getNotification } from "@/actions/getNotification";
import { FullNotificationType } from "@/types";

import { Bell } from "lucide-react";

const NotificationPage = async () => {
  const user = await getCurrentUser();
  const notifications = await getNotification();

  return (
    <div className="flex flex-col gap-4">
      <div className="lg:mt-7 flex items-center gap-2 justify-center border border-black dark:border-muted-foreground rounded-md p-1">
        <Bell className="w-7 h-7" strokeWidth={1.5} />
        <h1 className="text-xl md:text-2xl font-medium">Notification</h1>
      </div>
      <NotificationClient
        initialNotifications={notifications as FullNotificationType[]}
        currentUser={user!}
      />
    </div>
  );
};

export default NotificationPage;
