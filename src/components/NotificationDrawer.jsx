import React from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Trash2, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function NotificationDrawer({
  isOpen,
  onClose,
  notifications = [],
  onMarkAllRead,
  onClearNotifications,
  onSelectNotification
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 text-[#002875] border border-blue-200 shadow-sm">
                <Bell size={20} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#ff671f] font-bold">
                  SOVEREIGN NOTIFICATION HUB
                </span>
                <h2 className="font-cinzel text-lg font-bold text-[#002875]">
                  Official Alerts ({notifications.filter(n => !n.isRead).length})
                </h2>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-500 hover:text-slate-900 text-xl font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Quick action bar */}
          <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <button
              onClick={onMarkAllRead}
              className="text-[#002875] hover:underline cursor-pointer font-bold"
            >
              Mark all as read
            </button>
            <button
              onClick={onClearNotifications}
              className="text-slate-500 hover:text-red-600 cursor-pointer flex items-center gap-1 font-medium"
            >
              <Trash2 size={12} /> Clear all
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="py-16 text-center text-slate-500 space-y-2">
                <Bell size={32} className="mx-auto text-slate-400 opacity-50" />
                <p className="font-semibold text-sm text-slate-700">No new notifications</p>
                <p className="text-xs text-slate-500">All authority verifications and alerts are up to date.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => onSelectNotification?.(notif)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-1.5 shadow-sm ${
                    !notif.isRead 
                      ? 'bg-blue-50/50 border-[#002875]/40 shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-[#002875] font-bold flex items-center gap-1">
                      {notif.type === 'approval' && <CheckCircle2 size={13} className="text-[#0D6838]" />}
                      {notif.type === 'tatkal' && <Clock size={13} className="text-[#ea580c]" />}
                      {notif.type === 'security' && <AlertTriangle size={13} className="text-[#dc2626]" />}
                      {notif.sector || 'Sovereign Dispatch'}
                    </span>
                    <span className="text-slate-400 font-mono">{notif.timestamp || 'Today'}</span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900">
                    {notif.title}
                  </h4>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono">ID: {notif.id}</span>
                    <span className="text-[#002875] font-semibold hover:underline flex items-center gap-1">
                      View Audit <ExternalLink size={10} />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer status */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#0D6838]" /> HSM-Chained Events
            </span>
            <span className="font-mono text-[11px]">ISO/IEC 27001</span>
          </div>

        </div>
      </div>
    </div>
  );
}
