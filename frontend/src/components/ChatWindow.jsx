import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, X, MessageCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const API = 'http://localhost:5000/api';

const ChatWindow = ({ booking, currentUserId, onClose }) => {
    const { darkMode } = useTheme();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchMessages();
        const s = io('http://localhost:5000', { auth: { token } });
        s.on('connect', () => s.emit('join_room', booking._id));
        s.on('receive_message', (msg) => setMessages(prev => [...prev, msg]));
        setSocket(s);
        return () => { s.emit('leave_room', booking._id); s.disconnect(); };
    }, [booking._id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`${API}/chat/${booking._id}`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) setMessages(await res.json());
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const sendMsg = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;
        socket.emit('send_message', { bookingId: booking._id, content: newMessage.trim() });
        setNewMessage('');
    };

    const fmtTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dk = darkMode;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-lg rounded-2xl shadow-2xl flex flex-col h-[600px] ${dk ? 'bg-gray-800' : 'bg-white'}`}>
                <div className={`flex items-center justify-between px-5 py-4 border-b ${dk ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div>
                        <h3 className={`text-[16px] font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>
                            <MessageCircle className="w-4 h-4 inline mr-2" />Chat — {booking.spaceId?.title}
                        </h3>
                        <p className={`text-[12px] mt-0.5 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Booking #{booking._id.slice(-6)}</p>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-xl ${dk ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-400'}`}><X className="w-5 h-5" /></button>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                    {loading ? (
                        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-blue-500 animate-spin" /></div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <MessageCircle className={`w-10 h-10 mb-3 ${dk ? 'text-gray-600' : 'text-gray-300'}`} />
                            <p className={`text-[14px] font-medium ${dk ? 'text-gray-500' : 'text-gray-400'}`}>No messages yet</p>
                        </div>
                    ) : messages.map((msg, i) => {
                        const isMe = msg.senderId?._id === currentUserId || msg.senderId === currentUserId;
                        return (
                            <div key={msg._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${isMe ? 'bg-blue-600 text-white rounded-br-md' : dk ? 'bg-gray-700 text-gray-200 rounded-bl-md' : 'bg-gray-100 text-gray-800 rounded-bl-md'}`}>
                                    {!isMe && <p className={`text-[11px] font-semibold mb-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{msg.senderId?.name || 'User'}</p>}
                                    <p className="text-[13px] leading-relaxed">{msg.content}</p>
                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : dk ? 'text-gray-500' : 'text-gray-400'}`}>{fmtTime(msg.createdAt)}</p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={sendMsg} className={`flex items-center gap-2 px-4 py-3 border-t ${dk ? 'border-gray-700' : 'border-gray-100'}`}>
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..."
                        className={`flex-1 rounded-xl py-2.5 px-4 text-[14px] outline-none border ${dk ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-600'}`} />
                    <button type="submit" disabled={!newMessage.trim()} className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-40"><Send className="w-4 h-4" /></button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
