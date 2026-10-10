import React from 'react';
import { NotificationItem } from '../types';
import { Bell, Check, Trash2, Mail, Calendar, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface NotificationsPopoverProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectLead: (leadId: string) => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onSelectLead,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'email_sent':
        return <Mail className="w-4 h-4 text-indigo-600" />;
      case 'calendar_booked':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'lead_qualified':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'high_priority':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  const formatTime = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-slate-800">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-[11px] font-bold bg-indigo-100 text-indigo-700 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-medium"
            >
              <Check className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-slate-400 hover:text-rose-600"
              title="Clear all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No notifications right now. Scout leads to receive alerts!
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (!n.read) onMarkAsRead(n.id);
                if (n.leadId) {
                  onSelectLead(n.leadId);
                  onClose();
                }
              }}
              className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                !n.read ? 'bg-indigo-50/30' : ''
              }`}
            >
              <div className="p-2 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                {getNotificationIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-semibold text-slate-800 truncate">{n.title}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{formatTime(n.timestamp)}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug line-clamp-2">{n.message}</p>
                {n.leadId && (
                  <div className="mt-1.5 flex items-center gap-1 text-[11px] text-indigo-600 font-medium">
                    <span>View Lead Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
