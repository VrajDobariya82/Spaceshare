import React, { useEffect, useState } from 'react';
import { Home, LayoutDashboard, Users, Building, CalendarDays, LogOut, Trash2, Loader2, MapPin, Clock, CheckCircle2, XCircle, TrendingUp, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import DarkModeToggle from './DarkModeToggle';
import NotificationBell from './NotificationBell';

const API = 'http://localhost:5000/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const dk = darkMode;
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [spaces, setSpaces] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => { if (!token) { navigate('/login'); return; } loadDashboard(); }, []);

    const loadDashboard = async () => {
        setLoading(true);
        try {
            const h = { Authorization: `Bearer ${token}` };
            const [uR, sR, bR] = await Promise.all([fetch(`${API}/admin/users`,{headers:h}), fetch(`${API}/admin/spaces`,{headers:h}), fetch(`${API}/admin/bookings`,{headers:h})]);
            if (uR.ok) setUsers(await uR.json());
            if (sR.ok) setSpaces(await sR.json());
            if (bR.ok) setBookings(await bR.json());
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete?')) return;
        try { const r = await fetch(`${API}/admin/users/${id}`,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}}); if (!r.ok) { const d=await r.json(); throw new Error(d.message); } setUsers(p=>p.filter(u=>u._id!==id)); toast.success('Deleted'); } catch(e) { toast.error(e.message); }
    };

    const handleDeleteSpace = async (id) => {
        if (!window.confirm('Delete?')) return;
        try { const r = await fetch(`${API}/admin/spaces/${id}`,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}}); if (!r.ok) throw new Error('Failed'); setSpaces(p=>p.filter(s=>s._id!==id)); toast.success('Deleted'); } catch(e) { toast.error(e.message); }
    };

    const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); };
    const roleBadge = (role) => { const s={renter:'bg-blue-50 text-blue-600 border-blue-200',owner:'bg-purple-50 text-purple-600 border-purple-200',admin:'bg-gray-800 text-white border-gray-700'}; return <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${s[role]}`}>{role}</span>; };
    const statusBadge = (st) => { const s={pending:'bg-amber-50 text-amber-600 border-amber-200',approved:'bg-emerald-50 text-emerald-600 border-emerald-200',rejected:'bg-red-50 text-red-600 border-red-200'}; return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${s[st]}`}>{st}</span>; };
    const initials = (n) => n ? n.split(' ').map(x=>x[0]).join('').toUpperCase().slice(0,2) : '??';
    const colors = ['bg-blue-100 text-blue-600','bg-purple-100 text-purple-600','bg-amber-100 text-amber-600','bg-pink-100 text-pink-600','bg-emerald-100 text-emerald-600'];

    const totalRevenue = bookings.filter(b=>b.status==='approved').reduce((s,b)=>{const h=Math.max(1,Math.ceil((new Date(b.endDate)-new Date(b.startDate))/(1000*60*60)));return s+(h*(b.spaceId?.price||0));},0);

    return (
        <div className={`flex h-screen font-sans overflow-hidden ${dk?'bg-gray-900':'bg-[#F8FAFC]'}`}>
            <aside className={`w-[260px] border-r flex flex-col justify-between shrink-0 h-full ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                <div>
                    <div className="px-6 py-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm"><Home className="w-5 h-5 text-white"/></div>
                        <div><span className={`text-[18px] font-bold leading-none block ${dk?'text-white':'text-gray-900'}`}>SpaceShare</span><span className="text-[10px] font-bold text-gray-400 tracking-wider mt-0.5 block">Admin Portal</span></div>
                    </div>
                    <nav className="px-4 space-y-1">
                        <div className="px-4 pt-2 pb-2"><div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Management</div></div>
                        {[{key:'dashboard',icon:LayoutDashboard,label:'Dashboard'},{key:'users',icon:Users,label:'Manage Users'},{key:'spaces',icon:Building,label:'Space Listings'},{key:'bookings',icon:CalendarDays,label:'Bookings'}].map(item=>(
                            <button key={item.key} onClick={()=>setActiveTab(item.key)} className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-[14px] transition-colors w-full ${activeTab===item.key?(dk?'bg-blue-900/30 text-blue-400':'bg-blue-50/70 text-blue-600'):(dk?'text-gray-400 hover:text-white hover:bg-gray-700':'text-gray-500 hover:text-gray-900 hover:bg-gray-50')}`}>
                                <item.icon className="w-[18px] h-[18px]"/> {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className={`p-4 border-t ${dk?'border-gray-700':'border-gray-100'}`}>
                    <button onClick={handleLogout} className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-[14px] w-full ${dk?'text-gray-400 hover:text-white hover:bg-gray-700':'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}><LogOut className="w-[18px] h-[18px]"/> Log Out</button>
                    <div className={`flex items-center gap-3 p-3 rounded-xl mt-2 ${dk?'bg-gray-700':'bg-gray-50'}`}>
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-[13px] font-bold">{initials(user.name||'Admin')}</div>
                        <div className="overflow-hidden"><h4 className={`text-[13px] font-bold truncate ${dk?'text-white':'text-gray-900'}`}>{user.name}</h4><p className="text-[11px] text-gray-500 truncate">{user.email}</p></div>
                    </div>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto w-full">
                <div className="p-8 max-w-[1400px] mx-auto">
                    <div className="flex items-center justify-end gap-3 mb-4"><NotificationBell /><DarkModeToggle /></div>
                    {loading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin"/></div>
                    : activeTab === 'dashboard' ? (
                        <>
                            <h1 className={`text-[28px] font-bold tracking-tight mb-2 ${dk?'text-white':'text-gray-900'}`}>Platform Overview</h1>
                            <p className={`text-[14px] mb-8 ${dk?'text-gray-400':'text-gray-500'}`}>Real-time platform statistics.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                                {[{l:'Total Users',v:users.length,icon:Users,c:'bg-blue-50 text-blue-600'},{l:'Active Listings',v:spaces.length,icon:Building,c:'bg-emerald-50 text-emerald-600'},{l:'Total Bookings',v:bookings.length,icon:CalendarDays,c:'bg-purple-50 text-purple-600'},{l:'Est. Revenue',v:`$${totalRevenue}`,icon:DollarSign,c:'bg-amber-50 text-amber-600'}].map((s,i)=>(
                                    <div key={i} className={`p-6 rounded-[20px] shadow-sm border ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`text-[13px] font-bold ${dk?'text-gray-400':'text-gray-500'}`}>{s.l}</div>
                                            <div className={`w-8 h-8 rounded-lg ${s.c} flex items-center justify-center`}><s.icon className="w-4 h-4"/></div>
                                        </div>
                                        <div className={`text-[32px] font-bold leading-none ${dk?'text-white':'text-gray-900'}`}>{s.v}</div>
                                    </div>
                                ))}
                            </div>
                            <div className={`rounded-[20px] p-6 shadow-sm border ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                                <h3 className={`text-[16px] font-bold mb-5 ${dk?'text-white':'text-gray-900'}`}>Recent Users</h3>
                                <div className="space-y-3">
                                    {users.slice(0,5).map((u,i)=>(
                                        <div key={u._id} className="flex items-center justify-between py-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full ${colors[i%colors.length]} flex items-center justify-center text-[13px] font-bold`}>{initials(u.name)}</div>
                                                <div><h4 className={`text-[13.5px] font-bold ${dk?'text-white':'text-gray-900'}`}>{u.name}</h4><p className="text-[11px] text-gray-500">{u.email}</p></div>
                                            </div>
                                            {roleBadge(u.role)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : activeTab === 'users' ? (
                        <>
                            <h1 className={`text-[28px] font-bold tracking-tight mb-6 ${dk?'text-white':'text-gray-900'}`}>Manage Users</h1>
                            <div className={`rounded-[20px] shadow-sm border overflow-hidden ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                                <div className={`grid grid-cols-12 gap-4 py-3 px-6 text-[12px] font-bold border-b ${dk?'bg-gray-750 text-gray-400 border-gray-700':'bg-gray-50/50 text-gray-500 border-gray-100'}`}>
                                    <div className="col-span-4">User</div><div className="col-span-3">Email</div><div className="col-span-2">Role</div><div className="col-span-2">Joined</div><div className="col-span-1 text-right">Action</div>
                                </div>
                                {users.map((u,i)=>(
                                    <div key={u._id} className={`grid grid-cols-12 gap-4 py-4 px-6 items-center border-b ${dk?'border-gray-700 hover:bg-gray-750':'border-gray-50 hover:bg-gray-50/30'}`}>
                                        <div className="col-span-4 flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full ${colors[i%colors.length]} flex items-center justify-center text-[11px] font-bold shrink-0`}>{initials(u.name)}</div>
                                            <span className={`text-[13.5px] font-bold ${dk?'text-white':'text-gray-900'}`}>{u.name}</span>
                                        </div>
                                        <div className={`col-span-3 text-[13px] truncate ${dk?'text-gray-400':'text-gray-600'}`}>{u.email}</div>
                                        <div className="col-span-2">{roleBadge(u.role)}</div>
                                        <div className={`col-span-2 text-[12px] ${dk?'text-gray-500':'text-gray-500'}`}>{new Date(u.createdAt).toLocaleDateString()}</div>
                                        <div className="col-span-1 flex justify-end">
                                            <button onClick={()=>handleDeleteUser(u._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg" disabled={u._id===user.id}><Trash2 className="w-4 h-4"/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : activeTab === 'spaces' ? (
                        <>
                            <h1 className={`text-[28px] font-bold tracking-tight mb-6 ${dk?'text-white':'text-gray-900'}`}>All Space Listings</h1>
                            {spaces.length===0 ? <div className={`rounded-2xl p-12 border shadow-sm text-center ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}><Building className="w-10 h-10 text-gray-300 mx-auto mb-3"/><p className={dk?'text-gray-400':'text-gray-500'}>No spaces</p></div>
                            : <div className="space-y-4">{spaces.map(s=>(
                                <div key={s._id} className={`rounded-2xl p-5 border shadow-sm flex items-center justify-between ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 ${dk?'bg-gray-700':'bg-gray-100'}`}><Building className="w-5 h-5 text-gray-300"/></div>
                                        <div>
                                            <h3 className={`text-[15px] font-bold ${dk?'text-white':'text-gray-900'}`}>{s.title}</h3>
                                            <div className="flex items-center gap-3 text-[12px] text-gray-500 mt-1">
                                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/>{s.location}</span>
                                                <span>${s.price}/hr</span>
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${dk?'bg-gray-700':'bg-gray-100'}`}>{s.type}</span>
                                            </div>
                                            <p className="text-[11px] text-gray-400 mt-1">Owner: {s.ownerId?.name||'Unknown'}</p>
                                        </div>
                                    </div>
                                    <button onClick={()=>handleDeleteSpace(s._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                                </div>
                            ))}</div>}
                        </>
                    ) : (
                        <>
                            <h1 className={`text-[28px] font-bold tracking-tight mb-6 ${dk?'text-white':'text-gray-900'}`}>All Bookings</h1>
                            {bookings.length===0 ? <div className={`rounded-2xl p-12 border shadow-sm text-center ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}><CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-3"/><p className={dk?'text-gray-400':'text-gray-500'}>No bookings</p></div>
                            : <div className={`rounded-[20px] shadow-sm border overflow-hidden ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                                <div className={`grid grid-cols-12 gap-4 py-3 px-6 text-[12px] font-bold border-b ${dk?'text-gray-400 border-gray-700':'text-gray-500 border-gray-100'}`}>
                                    <div className="col-span-3">Space</div><div className="col-span-2">Renter</div><div className="col-span-3">Dates</div><div className="col-span-2">Status</div><div className="col-span-2">Booked</div>
                                </div>
                                {bookings.map(b=>(
                                    <div key={b._id} className={`grid grid-cols-12 gap-4 py-4 px-6 items-center border-b ${dk?'border-gray-700':'border-gray-50'}`}>
                                        <div className={`col-span-3 text-[13px] font-bold ${dk?'text-white':'text-gray-900'}`}>{b.spaceId?.title||'Deleted'}</div>
                                        <div className={`col-span-2 text-[13px] ${dk?'text-gray-400':'text-gray-600'}`}>{b.userId?.name||'Unknown'}</div>
                                        <div className={`col-span-3 text-[12px] ${dk?'text-gray-500':'text-gray-500'}`}>{new Date(b.startDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })} — {new Date(b.endDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</div>
                                        <div className="col-span-2">{statusBadge(b.status)}</div>
                                        <div className={`col-span-2 text-[12px] ${dk?'text-gray-500':'text-gray-500'}`}>{new Date(b.createdAt).toLocaleDateString()}</div>
                                    </div>
                                ))}
                            </div>}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
