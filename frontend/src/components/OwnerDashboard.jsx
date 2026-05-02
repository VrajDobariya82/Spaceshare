import React, { useEffect, useState } from 'react';
import {
    Home, LayoutDashboard, PlusSquare, LogOut, Plus, MapPin,
    DollarSign, FileText, X, Building2, CalendarDays, ImageIcon,
    Upload, Trash2, CheckCircle2, XCircle, Clock, Loader2, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const API = 'http://localhost:5000/api';

const OwnerDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('spaces');
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [spaceType, setSpaceType] = useState('room');

    const [submitting, setSubmitting] = useState(false);

    // Bookings state
    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        fetchMySpaces();
    }, []);

    const fetchMySpaces = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/spaces/my`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (res.ok) setSpaces(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchBookings = async () => {
        setBookingsLoading(true);
        try {
            const res = await fetch(`${API}/bookings/owner`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (res.ok) setBookings(data);
        } catch (err) { console.error(err); }
        finally { setBookingsLoading(false); }
    };



    const handleAddSpace = async (e) => {
        e.preventDefault();
        if (!title || !location || !price) { toast.error('Please fill title, location and price'); return; }
        setSubmitting(true);
        try {
            const payload = { title, location, price, description, type: spaceType };

            const res = await fetch(`${API}/spaces`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            toast.success('Space added successfully!');
            setSpaces([data, ...spaces]);
            resetForm();
        } catch (err) { toast.error(err.message || 'Failed to add space'); }
        finally { setSubmitting(false); }
    };

    const handleDeleteSpace = async (id) => {
        if (!window.confirm('Delete this space?')) return;
        try {
            const res = await fetch(`${API}/spaces/${id}`, {
                method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete');
            setSpaces(prev => prev.filter(s => s._id !== id));
            toast.success('Space deleted');
        } catch (err) { toast.error(err.message); }
    };

    const handleBookingAction = async (id, status) => {
        try {
            const res = await fetch(`${API}/bookings/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setBookings(prev => prev.map(b => b._id === id ? data : b));
            toast.success(`Booking ${status}`);
        } catch (err) { toast.error(err.message); }
    };

    const resetForm = () => {
        setTitle(''); setLocation(''); setPrice(''); setDescription('');
        setSpaceType('room'); setShowForm(false);
    };

    const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); };

    const typeLabel = { room: '🏠 Room', office: '🏢 Office', storage: '📦 Storage', event: '🎉 Event' };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col justify-between shrink-0 h-full">
                <div>
                    <div className="px-6 py-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                            <Home className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[18px] font-bold text-gray-900 leading-none block tracking-tight">SpaceShare</span>
                            <span className="text-[10px] font-bold text-gray-400 tracking-wider mt-0.5 block">Owner Portal</span>
                        </div>
                    </div>
                    <nav className="px-4 space-y-1">
                        <button onClick={() => { setActiveTab('spaces'); setShowForm(false); fetchMySpaces(); }}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-[14px] transition-colors w-full ${activeTab === 'spaces' && !showForm ? 'bg-blue-50/70 text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                            <LayoutDashboard className="w-[18px] h-[18px]" /> My Spaces
                        </button>
                        <button onClick={() => { setActiveTab('spaces'); setShowForm(true); }}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-[14px] transition-colors w-full ${showForm ? 'bg-blue-50/70 text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                            <PlusSquare className="w-[18px] h-[18px]" /> Add New Space
                        </button>
                        <button onClick={() => { setActiveTab('bookings'); setShowForm(false); fetchBookings(); }}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-[14px] transition-colors w-full ${activeTab === 'bookings' ? 'bg-blue-50/70 text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                            <CalendarDays className="w-[18px] h-[18px]" /> Bookings
                        </button>
                        <button onClick={() => { setActiveTab('profile'); setShowForm(false); }}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-[14px] transition-colors w-full ${activeTab === 'profile' ? 'bg-blue-50/70 text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                            <User className="w-[18px] h-[18px]" /> My Profile
                        </button>
                    </nav>
                </div>
                <div className="p-4 border-t border-gray-100">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium text-[14px] transition-colors w-full">
                        <LogOut className="w-[18px] h-[18px]" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto px-8 py-6">
                <div className="max-w-[900px] mx-auto">
                    {activeTab === 'bookings' ? (
                        /* ==================== BOOKINGS TAB ==================== */
                        <>
                            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight mb-6">Booking Requests</h1>
                            {bookingsLoading ? (
                                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
                            ) : bookings.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"><CalendarDays className="w-7 h-7 text-gray-300" /></div>
                                    <p className="text-[16px] font-medium text-gray-500 mb-2">No bookings yet</p>
                                    <p className="text-[14px] text-gray-400">Bookings will appear here when renters request your spaces.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {bookings.map(b => (
                                        <div key={b._id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-[17px] font-bold text-gray-900 mb-1">{b.spaceId?.title}</h3>
                                                    <p className="text-[13px] text-gray-500">
                                                        <span className="font-medium">Renter:</span> {b.userId?.name} ({b.userId?.email})
                                                    </p>
                                                    <p className="text-[13px] text-gray-500 mt-1">
                                                        <span className="font-medium">Dates:</span> {new Date(b.startDate).toLocaleDateString()} — {new Date(b.endDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                                    b.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                    b.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                    'bg-red-50 text-red-600 border-red-200'
                                                }`}>
                                                    {b.status === 'pending' ? <Clock className="w-3 h-3" /> : b.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                                                </span>
                                            </div>
                                            {b.status === 'pending' && (
                                                <div className="flex gap-2 pt-3 border-t border-gray-100">
                                                    <button onClick={() => handleBookingAction(b._id, 'rejected')} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-[13px] font-semibold hover:bg-gray-50 transition-colors">Reject</button>
                                                    <button onClick={() => handleBookingAction(b._id, 'approved')} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[13px] font-semibold hover:bg-emerald-700 transition-colors">Approve</button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : showForm ? (
                        /* ==================== ADD SPACE FORM ==================== */
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Add New Space</h1>
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
                            </div>
                            <form onSubmit={handleAddSpace} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Title</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Building2 className="h-[18px] w-[18px] text-gray-400" /></div>
                                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Downtown Co-working Space"
                                                className="block w-full rounded-xl bg-gray-50/50 border border-gray-200 py-3 pl-11 pr-4 text-[15px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Location</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><MapPin className="h-[18px] w-[18px] text-gray-400" /></div>
                                            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. New York, NY"
                                                className="block w-full rounded-xl bg-gray-50/50 border border-gray-200 py-3 pl-11 pr-4 text-[15px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all" />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Price ($/hour)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><DollarSign className="h-[18px] w-[18px] text-gray-400" /></div>
                                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 50" min="1"
                                                className="block w-full rounded-xl bg-gray-50/50 border border-gray-200 py-3 pl-11 pr-4 text-[15px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Space Type</label>
                                        <select value={spaceType} onChange={e => setSpaceType(e.target.value)}
                                            className="block w-full rounded-xl bg-gray-50/50 border border-gray-200 py-3 px-4 text-[15px] text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all">
                                            <option value="room">🏠 Room</option>
                                            <option value="office">🏢 Office</option>
                                            <option value="storage">📦 Storage</option>
                                            <option value="event">🎉 Event Space</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Description (optional)</label>
                                    <div className="relative">
                                        <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none"><FileText className="h-[18px] w-[18px] text-gray-400" /></div>
                                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your space..." rows={3}
                                            className="block w-full rounded-xl bg-gray-50/50 border border-gray-200 py-3 pl-11 pr-4 text-[15px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all resize-none" />
                                    </div>
                                </div>

                                <button type="submit" disabled={submitting}
                                    className={`w-full flex items-center justify-center gap-2 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition-all duration-200 text-[15px] ${submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                    <Plus className="w-4 h-4" /> {submitting ? 'Adding...' : 'Add Space'}
                                </button>
                            </form>
                        </div>
                    ) : activeTab === 'spaces' && !showForm ? (
                        /* ==================== MY SPACES LIST ==================== */
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">My Spaces</h1>
                                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[14px] font-medium shadow-sm transition-colors">
                                    <Plus className="w-4 h-4" /> Add New Space
                                </button>
                            </div>
                            {loading ? (
                                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
                            ) : spaces.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"><Building2 className="w-7 h-7 text-gray-300" /></div>
                                    <p className="text-[16px] font-medium text-gray-500 mb-2">No spaces listed yet</p>
                                    <p className="text-[14px] text-gray-400 mb-6">Add your first space to start receiving bookings.</p>
                                    <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-[14px] font-medium transition-colors">
                                        <Plus className="w-4 h-4" /> Add Space
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {spaces.map(space => (
                                        <div key={space._id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between">
                                                <div className="flex gap-4">
                                                    {space.images && space.images.length > 0 ? (
                                                        <img src={space.images[0]} alt="" className="w-20 h-20 object-cover rounded-xl shrink-0" />
                                                    ) : (
                                                        <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center shrink-0"><ImageIcon className="w-6 h-6 text-gray-300" /></div>
                                                    )}
                                                    <div>
                                                        <h3 className="text-[18px] font-bold text-gray-900 mb-1">{space.title}</h3>
                                                        <div className="flex items-center gap-4 text-[14px] text-gray-500">
                                                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" />{space.location}</span>
                                                            <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-gray-400" />${space.price}/hr</span>
                                                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-[11px] font-semibold">{typeLabel[space.type] || space.type}</span>
                                                        </div>
                                                        {space.description && <p className="text-[13px] text-gray-400 mt-2 line-clamp-2">{space.description}</p>}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="bg-emerald-100/60 text-emerald-600 border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {space.availability ? 'Active' : 'Inactive'}
                                                    </span>
                                                    <button onClick={() => handleDeleteSpace(space._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ==================== MY PROFILE ==================== */
                        <>
                            <header className="mb-8">
                                <h1 className="text-[32px] font-extrabold text-gray-900 tracking-tight mb-2">My Profile</h1>
                                <p className="text-[16px] text-gray-500 font-medium">Manage your account details and preferences.</p>
                            </header>
                            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm max-w-2xl">
                                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                                    <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[32px] font-bold">
                                        {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                                    </div>
                                    <div>
                                        <h2 className="text-[24px] font-bold text-gray-900">{user.name || 'User'}</h2>
                                        <p className="text-[15px] text-gray-500 mt-1">{user.email}</p>
                                        <span className="inline-block mt-3 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[12px] font-bold uppercase tracking-wider">
                                            {user.role} Account
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                                        <div className="text-[16px] text-gray-900 font-medium">{user.name || 'Not provided'}</div>
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                                        <div className="text-[16px] text-gray-900 font-medium">{user.email || 'Not provided'}</div>
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2">Account ID</label>
                                        <div className="text-[14px] text-gray-400 font-mono">{user.id || 'Unknown'}</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default OwnerDashboard;
