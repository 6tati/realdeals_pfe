import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    getMyNotifications,
    getUnreadNotificationsCount,
    markNotificationAsRead
} from '../services/api';

export default function NotificationBell({ open, setOpenMenu }) {
    const [notifications, setNotifications] = useState([]);
    const [count, setCount] = useState(0);
    const navigate = useNavigate();

    const loadNotifications = () => {
        getMyNotifications()
            .then(setNotifications)
            .catch(() => {});

        getUnreadNotificationsCount()
            .then(data => setCount(data.count || 0))
            .catch(() => {});
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleOpen = () => {
        if (open) {
            setOpenMenu(null);
        } else {
            setOpenMenu('notifications');
            loadNotifications();
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            await markNotificationAsRead(notification.idNotification);
            setOpenMenu(null);
            navigate('/my-orders');
        } catch {
            setOpenMenu(null);
            navigate('/my-orders');
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleOpen}
                className="relative flex items-center justify-center hover:text-neutral-500"
                aria-label="Notifications"
            >
                <Bell size={20} strokeWidth={2.2} />

                {count > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                        {count}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-4 w-80 max-h-96 overflow-y-auto bg-white border border-neutral-200 shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-neutral-200">
                        <p className="text-xs font-black uppercase tracking-widest">
                            Notifications
                        </p>
                    </div>

                    {notifications.length === 0 ? (
                        <p className="px-4 py-4 text-sm text-neutral-500">
                            No notifications yet.
                        </p>
                    ) : (
                        notifications.map(n => (
                            <button
                                key={n.idNotification}
                                onClick={() => handleNotificationClick(n)}
                                className={`w-full text-left px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 ${
                                    n.lu ? 'bg-white' : 'bg-neutral-50'
                                }`}
                            >
                                <p className="text-xs font-black uppercase tracking-widest">
                                    {n.titre}
                                </p>

                                <p className="mt-1 text-sm text-neutral-600">
                                    {n.message}
                                </p>

                                <p className="mt-1 text-[10px] text-neutral-400">
                                    {n.dateCreation ? new Date(n.dateCreation).toLocaleString() : ''}
                                </p>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}