import React, { useEffect, useState } from 'react';
import {
    Home, LayoutDashboard, Users, Building, CalendarDays,
    LogOut, Search, Trash2, Loader2, MapPin, DollarSign,
    Clock, CheckCircle2, XCircle, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const API = 'http://localhost:5000/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [spaces, setSpaces] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const [uRes, sRes, bRes] = await Promise.all([
                fetch(`${API}/admin/users`, { headers }),
                fetch(`${API}/admin/spaces`, { headers }),
                fetch(`${API}/admin/bookings`, { headers })
            ]);
            if (uRes.ok) setUsers(await uRes.json());
            if (sRes.ok) setSpaces(await sRes.json());
            if (bRes.ok) setBookings(await bRes.json());
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            const res = await fetch(`${API}/admin/users/${id}`, {
                method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
            setUsers(prev => prev.filter(u => u._id !== id));
            toast.success('User deleted');
        } catch (err) { toast.error(err.message); }
    };

    const handleDeleteSpace = async (id) => {
        if (!window.confirm('Delete this space?')) return;
        try {
            const res = await fetch(`${API}/admin/spaces/${id}`, {
                method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed');
            setSpaces(prev => prev.filter(s => s._id !== id));
            toast.success('Space deleted');
        } catch (err) { toast.error(err.message); }
    };

    const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); };

    const roleBadge = (role) => {
        const s = { renter: 'bg-blue-50 text-blue-600 border-blue-200', owner: 'bg-purple-50 text-purple-600 border-purple-200', admin: 'bg-gray-800 text-white border-gray-700' };
        return <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${s[role]}`}>{role}</span>;
    };

    const statusBadge = (status) => {
        const s = { pending: 'bg-amber-50 text-amber-600 border-amber-200', approved: 'bg-emerald-50 text-emerald-600 border-emerald-200', rejected: 'bg-red-50 text-red-600 border-red-200' };
        return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${s[status]}`}>
            {status === 'pending' ? <Clock className="w-3 h-3" /> : status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            {status}
        </span>;
    };

    const initials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';
    const colors = ['bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600', 'bg-amber-100 text-amber-600', 'bg-pink-100 text-pink-600', 'bg-emerald-100 text-emerald-600'];

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col justify-between shrink-0 h-full">
                <div>
                    <div className="px-6 py-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm"><Home className="w-5 h-5 text-white" /></div>
                        <div>
                            <span className="text-[18px] font-bold text-gray-900 leading-none block tracking-tight">SpaceShare</span>
                            <span className="text-[10px] font-bold text-gray-400 tracking-wider mt-0.5 block">Admin Portal</span>
                        </div>
                    </div>
                    <nav className="px-4 space-y-1">
                        <div className="px-4 pt-2 pb-2"><div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Management</div></div>
                        {[
                            { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                            { key: 'users', icon: Users, label: 'Manage Users' },
                            { key: 'spaces', icon: Building, label: 'Space Listings' },
                            { key: 'bookings', icon: CalendarDays, label: 'Bookings' }
                        ].map(item => (
                            <button key={item.key} onClick={() => setActiveTab(item.key)}
                                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-[14px] transition-colors w-full ${activeTab === item.key ? 'bg-blue-50/70 text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                                <item.icon className="w-[18px] h-[18px]" /> {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="p-4 border-t border-gray-100">
                    <button onClick={handleLogout} className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14px] transition-colors w-full">
                        <LogOut className="w-[18px] h-[18px]" /> Log Out
                    </button>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl mt-2">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-[13px] font-bold">{initials(user.name || 'Admin')}</div>
                        <div className="overflow-hidden">
                            <h4 className="text-[13px] font-bold text-gray-900 truncate">{user.name || 'Admin'}</h4>
                            <p className="text-[11px] text-gray-500 truncate">{user.email || 'admin'}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto w-full">
                <div className="p-8 max-w-[1400px] mx-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
                    ) : activeTab === 'dashboard' ? (
                        /* ==================== DASHBOARD ==================== */
                        <>
                            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight mb-2">Platform Overview</h1>
                            <p className="text-[14px] text-gray-500 mb-8">Real-time platform statistics.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                                {[
                                    { label: 'Total Users', value: users.length, icon: Users, color: 'bg-blue-50 text-blue-600' },
                                    { label: 'Active Listings', value: spaces.length, icon: Building, color: 'bg-emerald-50 text-emerald-600' },
                                    { label: 'Total Bookings', value: bookings.length, icon: CalendarDays, color: 'bg-purple-50 text-purple-600' },
                                    { label: 'Pending Bookings', value: bookings.filter(b => b.status === 'pending').length, icon: Clock, color: 'bg-amber-50 text-amber-600' }
                                ].map((s, i) => (
                                    <div key={i} className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="text-[13px] font-bold text-gray-500">{s.label}</div>
                                            <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center`}><s.icon className="w-4 h-4" /></div>
                                        </div>
                                        <div className="text-[32px] font-bold text-gray-900 leading-none">{s.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Users */}
                            <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
                                <h3 className="text-[16px] font-bold text-gray-900 mb-5">Recent Users</h3>
                                <div className="space-y-3">
                                    {users.slice(0, 5).map((u, i) => (
                                        <div key={u._id} className="flex items-center justify-between py-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full ${colors[i % colors.length]} flex items-center justify-center text-[13px] font-bold`}>{initials(u.name)}</div>
                                                <div>
                                                    <h4 className="text-[13.5px] font-bold text-gray-900">{u.name}</h4>
                                                    <p className="text-[11px] text-gray-500">{u.email}</p>
                                                </div>
                                            </div>
                                            {roleBadge(u.role)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : activeTab === 'users' ? (
                        /* ==================== USERS ==================== */
                        <>
                            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight mb-6">Manage Users</h1>
                            <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                                <div className="grid grid-cols-12 gap-4 py-3 px-6 bg-gray-50/50 text-[12px] font-bold text-gray-500 border-b border-gray-100">
                                    <div className="col-span-4">User</div>
                                    <div className="col-span-3">Email</div>
                                    <div className="col-span-2">Role</div>
                                    <div className="col-span-2">Joined</div>
                                    <div className="col-span-1 text-right">Action</div>
                                </div>
                                {users.length === 0 ? (
                                    <div className="p-12 text-center text-gray-400 text-[14px]">No users found</div>
                                ) : users.map((u, i) => (
                                    <div key={u._id} className="grid grid-cols-12 gap-4 py-4 px-6 items-center border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                                        <div className="col-span-4 flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full ${colors[i % colors.length]} flex items-center justify-center text-[11px] font-bold shrink-0`}>{initials(u.name)}</div>
                                            <span className="text-[13.5px] font-bold text-gray-900">{u.name}</span>
                                        </div>
                                        <div className="col-span-3 text-[13px] text-gray-600 truncate">{u.email}</div>
                                        <div className="col-span-2">{roleBadge(u.role)}</div>
                                        <div className="col-span-2 text-[12px] text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</div>
                                        <div className="col-span-1 flex justify-end">
                                            <button onClick={() => handleDeleteUser(u._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title={u._id === user.id ? "Can't delete yourself" : 'Delete user'} disabled={u._id === user.id}>
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : activeTab === 'spaces' ? (
                        /* ==================== SPACES ==================== */
                        <>
                            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight mb-6">All Space Listings</h1>
                            {spaces.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                                    <Building className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                    <p className="text-[15px] text-gray-500">No spaces listed yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {spaces.map(s => (
                                        <div key={s._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                {s.images?.length > 0 ? (
                                                    <img src={s.images[0]} alt="" className="w-16 h-16 object-cover rounded-xl shrink-0" />
                                                ) : (
                                                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center shrink-0"><Building className="w-5 h-5 text-gray-300" /></div>
                                                )}
                                                <div>
                                                    <h3 className="text-[15px] font-bold text-gray-900">{s.title}</h3>
                                                    <div className="flex items-center gap-3 text-[12px] text-gray-500 mt-1">
                                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{s.location}</span>
                                                        <span>${s.price}/hr</span>
                                                        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-semibold">{s.type}</span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-400 mt-1">Owner: {s.ownerId?.name || 'Unknown'}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDeleteSpace(s._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        /* ==================== BOOKINGS ==================== */
                        <>
                            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight mb-6">All Bookings</h1>
                            {bookings.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                                    <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                    <p className="text-[15px] text-gray-500">No bookings yet.</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="grid grid-cols-12 gap-4 py-3 px-6 bg-gray-50/50 text-[12px] font-bold text-gray-500 border-b border-gray-100">
                                        <div className="col-span-3">Space</div>
                                        <div className="col-span-2">Renter</div>
                                        <div className="col-span-3">Dates</div>
                                        <div className="col-span-2">Status</div>
                                        <div className="col-span-2">Booked On</div>
                                    </div>
                                    {bookings.map(b => (
                                        <div key={b._id} className="grid grid-cols-12 gap-4 py-4 px-6 items-center border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                                            <div className="col-span-3 text-[13px] font-bold text-gray-900">{b.spaceId?.title || 'Deleted'}</div>
                                            <div className="col-span-2 text-[13px] text-gray-600">{b.userId?.name || 'Unknown'}</div>
                                            <div className="col-span-3 text-[12px] text-gray-500">{new Date(b.startDate).toLocaleDateString()} — {new Date(b.endDate).toLocaleDateString()}</div>
                                            <div className="col-span-2">{statusBadge(b.status)}</div>
                                            <div className="col-span-2 text-[12px] text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
