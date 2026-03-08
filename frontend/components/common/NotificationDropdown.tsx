'use client';

import React from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotificationStore } from '@/lib/stores/notificationStore';
import { Notification } from '@/lib/types';

export function NotificationDropdown() {
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const removeNotification = useNotificationStore((state) => state.removeNotification);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const clearNotifications = useNotificationStore((state) => state.clearNotifications);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 bg-slate-900 border-slate-800">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h3 className="font-semibold text-white">Notifications</h3>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-slate-400 hover:text-white"
            >
              Mark all as read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p>No notifications yet</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-96">
              <div className="divide-y divide-slate-800">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 cursor-pointer transition-colors ${
                      notification.read
                        ? 'bg-slate-900 hover:bg-slate-800'
                        : 'bg-slate-800/50 hover:bg-slate-800'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-white">{notification.title}</p>
                        <p className="text-xs text-slate-400 mt-1">{notification.message}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <DropdownMenuSeparator className="bg-slate-800" />
            <Button
              variant="ghost"
              className="w-full justify-center text-xs text-slate-400 hover:text-white"
              onClick={clearNotifications}
            >
              Clear all
            </Button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
