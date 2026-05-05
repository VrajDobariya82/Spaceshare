import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const API = 'http://localhost:5000/api';

const NotificationBell = () => {
    const { darkMode } = useTheme();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const token = localStorage.getItem('token');

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${API}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            }
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        if (token) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 15000);
            return () => clearInterval(interval);
        }
    }, [token]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        try {
            await fetch(`${API}/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) { console.error(err); }
    };

    const markAllAsRead = async () => {
        try {
            await fetch(`${API}/notifications/read-all`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) { console.error(err); }
    };

    const typeIcon = (type) => {
        const map = {
            booking_request: '📋',
            booking_approved: '✅',
            booking_rejected: '❌',
            review: '⭐',
            general: '🔔'
        };
        return map[type] || '🔔';
    };

    const timeAgo = (date) => {
        const s = Math.floor((Date.now() - new Date(date)) / 1000);
        if (s < 60) return 'just now';
        if (s < 3600) return `${Math.floor(s / 60)}m ago`;
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
        return `${Math.floor(s / 86400)}d ago`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`relative p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className={`absolute right-0 top-12 w-80 rounded-2xl shadow-2xl border z-50 overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    <div className={`flex items-center justify-between px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                        <h3 className={`text-[14px] font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="text-[12px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className={`p-8 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                <p className="text-[13px]">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n._id}
                                    onClick={() => !n.isRead && markAsRead(n._id)}
                                    className={`px-4 py-3 flex items-start gap-3 cursor-pointer transition-colors border-b last:border-b-0 ${
                                        darkMode
                                            ? `border-gray-700 ${n.isRead ? 'bg-gray-800' : 'bg-gray-750 hover:bg-gray-700'}`
                                            : `border-gray-50 ${n.isRead ? 'bg-white' : 'bg-blue-50/30 hover:bg-blue-50/50'}`
                                    }`}
                                >
                                    <span className="text-[18px] mt-0.5">{typeIcon(n.type)}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-[13px] leading-snug ${darkMode ? (n.isRead ? 'text-gray-400' : 'text-gray-200') : (n.isRead ? 'text-gray-500' : 'text-gray-800')}`}>
                                            {n.message}
                                        </p>
                                        <span className={`text-[11px] mt-1 block ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {timeAgo(n.createdAt)}
                                        </span>
                                    </div>
                                    {!n.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></span>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
