import { useState } from "react";
import { Bell, X, Heart, MessageCircle, UserPlus, Award, LogOut, Settings } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useApp } from "./AppContext";

const notificationIcons = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  achievement: Award,
};

export default function NotificationBell() {
  const { state, markNotificationRead, logout } = useApp();
  const { notifications, currentUser } = state;
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleNotificationClick = (notificationId: string) => {
    markNotificationRead(notificationId);
  };

  const clearAll = () => {
    notifications.forEach(n => markNotificationRead(n.id));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1"
              >
                <Badge className="w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-medium">Notifications</h3>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <X className="w-4 h-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No notifications yet</p>
              <p className="text-xs text-gray-400 mt-1">
                We'll notify you when something happens
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type];
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-full ${
                        notification.type === 'like' ? 'bg-red-100 text-red-500' :
                        notification.type === 'comment' ? 'bg-blue-100 text-blue-500' :
                        notification.type === 'follow' ? 'bg-green-100 text-green-500' :
                        'bg-[#FFF3E0] text-[#FF6F00]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.timestamp}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* User Actions Footer */}
        <div className="border-t border-gray-100 p-2">
          <div className="px-2 py-1 mb-1">
            <p className="text-sm truncate">{currentUser?.name}</p>
            <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
          </div>
          
        </div>
      </PopoverContent>
    </Popover>
  );
}
