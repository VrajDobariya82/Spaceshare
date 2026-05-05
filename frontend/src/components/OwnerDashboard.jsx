import React, { useEffect, useState, useRef } from 'react';
import { Home, LayoutDashboard, PlusSquare, LogOut, Plus, MapPin, DollarSign, FileText, X, Building2, CalendarDays, ImageIcon, Trash2, Edit2, CheckCircle2, XCircle, Clock, Loader2, User, BarChart3, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import DarkModeToggle from './DarkModeToggle';
import NotificationBell from './NotificationBell';
import ChatWindow from './ChatWindow';

const API = 'http://localhost:5000/api';

const OwnerDashboard = () => {
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const dk = darkMode;
    const [activeTab, setActiveTab] = useState('spaces');
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [spaceType, setSpaceType] = useState('room');
    const [submitting, setSubmitting] = useState(false);
    const [editSpaceId, setEditSpaceId] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [chatBooking, setChatBooking] = useState(null);

    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const locDebounceRef = useRef(null);
    const locContainerRef = useRef(null);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => { 
        if (!token) { navigate('/login'); return; } 
        fetchMySpaces(); 
        
        const handleClickOutside = (e) => {
            if (locContainerRef.current && !locContainerRef.current.contains(e.target)) {
                setShowLocationSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchMySpaces = async () => {
        setLoading(true);
        try { const res = await fetch(`${API}/spaces/my`, { headers: { Authorization: `Bearer ${token}` } }); if (res.ok) setSpaces(await res.json()); }
        catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const fetchBookings = async () => {
        setBookingsLoading(true);
        try { const res = await fetch(`${API}/bookings/owner`, { headers: { Authorization: `Bearer ${token}` } }); if (res.ok) setBookings(await res.json()); }
        catch (e) { console.error(e); } finally { setBookingsLoading(false); }
    };

    const handleLocationChange = (value) => {
        setLocation(value);
        if (locDebounceRef.current) clearTimeout(locDebounceRef.current);
        if (value.length < 2) {
            setLocationSuggestions([]);
            setShowLocationSuggestions(false);
            return;
        }
        locDebounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`${API}/search/autocomplete?q=${encodeURIComponent(value)}`);
                const data = await res.json();
                // Extract unique locations
                const uniqueLocs = [...new Set(data.map(s => s.location))];
                setLocationSuggestions(uniqueLocs);
                setShowLocationSuggestions(true);
            } catch (err) { console.error(err); }
        }, 300);
    };

    const handleSubmitSpace = async (e) => {
        e.preventDefault();
        if (!title || !location || !price) { toast.error('Fill title, location and price'); return; }
        setSubmitting(true);
        try {
            const url = editSpaceId ? `${API}/spaces/${editSpaceId}` : `${API}/spaces`;
            const method = editSpaceId ? 'PUT' : 'POST';
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ title, location, price, description, type: spaceType }) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            toast.success(editSpaceId ? 'Space updated!' : 'Space added!'); 
            if (editSpaceId) {
                setSpaces(p => p.map(s => s._id === editSpaceId ? data : s));
            } else {
                setSpaces([data, ...spaces]); 
            }
            resetForm();
        } catch (e) { toast.error(e.message); } finally { setSubmitting(false); }
    };

    const openEditSpace = (space) => {
        setTitle(space.title);
        setLocation(space.location);
        setPrice(space.price);
        setDescription(space.description || '');
        setSpaceType(space.type);
        setEditSpaceId(space._id);
        setActiveTab('spaces');
        setShowForm(true);
    };

    const handleDeleteSpace = async (id) => {
        if (!window.confirm('Delete this space?')) return;
        try { const res = await fetch(`${API}/spaces/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); if (!res.ok) throw new Error('Failed'); setSpaces(p => p.filter(s => s._id !== id)); toast.success('Deleted'); }
        catch (e) { toast.error(e.message); }
    };

    const handleBookingAction = async (id, status) => {
        try {
            const res = await fetch(`${API}/bookings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setBookings(p => p.map(b => b._id === id ? data : b)); toast.success(`Booking ${status}`);
        } catch (e) { toast.error(e.message); }
    };

    const resetForm = () => { setTitle(''); setLocation(''); setPrice(''); setDescription(''); setSpaceType('room'); setEditSpaceId(null); setShowForm(false); };
    const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); };
    const typeLabel = { room: '🏠 Room', office: '🏢 Office', storage: '📦 Storage', event: '🎉 Event' };

    // Analytics
    const totalSpaces = spaces.length;
    const totalBookings = bookings.length;
    const approvedBookings = bookings.filter(b => b.status === 'approved');
    const mockEarnings = approvedBookings.reduce((sum, b) => {
        const hours = Math.max(1, Math.ceil((new Date(b.endDate) - new Date(b.startDate)) / (1000 * 60 * 60)));
        return sum + (hours * (b.spaceId?.price || 0));
    }, 0);

    return (
        <div className={`flex h-screen font-sans overflow-hidden ${dk?'bg-gray-900':'bg-[#F8FAFC]'}`}>
            <aside className={`w-[260px] border-r flex flex-col justify-between shrink-0 h-full ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                <div>
                    <div className="px-6 py-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm"><Home className="w-5 h-5" /></div>
                        <div>
                            <span className={`text-[18px] font-bold leading-none block ${dk?'text-white':'text-gray-900'}`}>SpaceShare</span>
                            <span className="text-[10px] font-bold text-gray-400 tracking-wider mt-0.5 block">Owner Portal</span>
                        </div>
                    </div>
                    <nav className="px-4 space-y-1">
                        {[{key:'spaces',icon:LayoutDashboard,label:'My Spaces',fn:()=>{setActiveTab('spaces');setShowForm(false);fetchMySpaces();}},
                          {key:'add',icon:PlusSquare,label:'Add New Space',fn:()=>{setActiveTab('spaces');setShowForm(true);}},
                          {key:'bookings',icon:CalendarDays,label:'Bookings',fn:()=>{setActiveTab('bookings');setShowForm(false);fetchBookings();}},
                          {key:'analytics',icon:BarChart3,label:'Analytics',fn:()=>{setActiveTab('analytics');setShowForm(false);fetchMySpaces();fetchBookings();}},
                          {key:'profile',icon:User,label:'My Profile',fn:()=>{setActiveTab('profile');setShowForm(false);}}
                        ].map(item=>(
                            <button key={item.key} onClick={item.fn} className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-[14px] transition-colors w-full ${(activeTab===item.key||(item.key==='add'&&showForm)) ? (dk?'bg-blue-900/30 text-blue-400':'bg-blue-50/70 text-blue-600') : (dk?'text-gray-400 hover:text-white hover:bg-gray-700':'text-gray-500 hover:text-gray-900 hover:bg-gray-50')}`}>
                                <item.icon className="w-[18px] h-[18px]" /> {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className={`p-4 border-t ${dk?'border-gray-700':'border-gray-100'}`}>
                    <button onClick={handleLogout} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-[14px] w-full ${dk?'text-red-400 hover:bg-red-900/20':'text-red-500 hover:bg-red-50'}`}>
                        <LogOut className="w-[18px] h-[18px]" /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto px-8 py-6">
                <div className="flex items-center justify-end gap-3 mb-4"><NotificationBell /><DarkModeToggle /></div>
                <div className="max-w-[900px] mx-auto">
                    {activeTab === 'analytics' ? (
                        <>
                            <h1 className={`text-[28px] font-bold tracking-tight mb-6 ${dk?'text-white':'text-gray-900'}`}>Dashboard Analytics</h1>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                                {[{label:'Total Spaces',value:totalSpaces,color:'bg-blue-50 text-blue-600'},{label:'Total Bookings',value:totalBookings,color:'bg-purple-50 text-purple-600'},{label:'Est. Earnings',value:`$${mockEarnings}`,color:'bg-emerald-50 text-emerald-600'}].map((s,i)=>(
                                    <div key={i} className={`p-6 rounded-[20px] shadow-sm border ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                                        <div className={`text-[13px] font-bold mb-2 ${dk?'text-gray-400':'text-gray-500'}`}>{s.label}</div>
                                        <div className={`text-[32px] font-bold ${dk?'text-white':'text-gray-900'}`}>{s.value}</div>
                                    </div>
                                ))}
                            </div>
                            <div className={`rounded-[20px] p-6 shadow-sm border ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                                <h3 className={`text-[16px] font-bold mb-4 ${dk?'text-white':'text-gray-900'}`}>Recent Bookings</h3>
                                {bookings.slice(0,5).map(b=>(
                                    <div key={b._id} className={`flex justify-between py-2 border-b last:border-b-0 ${dk?'border-gray-700':'border-gray-100'}`}>
                                        <span className={`text-[13px] ${dk?'text-gray-300':'text-gray-700'}`}>{b.spaceId?.title} — {b.userId?.name}</span>
                                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${b.status==='approved'?'bg-emerald-100 text-emerald-600':b.status==='pending'?'bg-amber-100 text-amber-600':'bg-red-100 text-red-600'}`}>{b.status}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : activeTab === 'bookings' ? (
                        <>
                            <h1 className={`text-[28px] font-bold tracking-tight mb-6 ${dk?'text-white':'text-gray-900'}`}>Booking Requests</h1>
                            {bookingsLoading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
                            : bookings.length === 0 ? <div className={`rounded-2xl p-12 border shadow-sm text-center ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}><p className={`text-[16px] ${dk?'text-gray-400':'text-gray-500'}`}>No bookings yet</p></div>
                            : <div className="space-y-4">{bookings.map(b=>(
                                <div key={b._id} className={`rounded-2xl p-6 border shadow-sm ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className={`text-[17px] font-bold mb-1 ${dk?'text-white':'text-gray-900'}`}>{b.spaceId?.title}</h3>
                                            <p className="text-[13px] text-gray-500"><span className="font-medium">Renter:</span> {b.userId?.name} ({b.userId?.email})</p>
                                            <p className="text-[13px] text-gray-500 mt-1"><span className="font-medium">Time:</span> {new Date(b.startDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })} — {new Date(b.endDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${b.status==='pending'?'bg-amber-50 text-amber-600 border-amber-200':b.status==='approved'?'bg-emerald-50 text-emerald-600 border-emerald-200':'bg-red-50 text-red-600 border-red-200'}`}>
                                            {b.status==='pending'?<Clock className="w-3 h-3"/>:b.status==='approved'?<CheckCircle2 className="w-3 h-3"/>:<XCircle className="w-3 h-3"/>}{b.status}
                                        </span>
                                    </div>
                                    <div className={`flex gap-2 pt-3 border-t ${dk?'border-gray-700':'border-gray-100'}`}>
                                        {b.status === 'pending' && <>
                                            <button onClick={()=>handleBookingAction(b._id,'rejected')} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-[13px] font-semibold hover:bg-gray-50">Reject</button>
                                            <button onClick={()=>handleBookingAction(b._id,'approved')} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[13px] font-semibold hover:bg-emerald-700">Approve</button>
                                        </>}
                                        <button onClick={()=>setChatBooking(b)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium ${dk?'bg-gray-700 text-gray-300':'bg-gray-100 text-gray-600'}`}><MessageCircle className="w-3.5 h-3.5"/>Chat</button>
                                    </div>
                                </div>
                            ))}</div>}
                        </>
                    ) : showForm ? (
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h1 className={`text-[28px] font-bold ${dk?'text-white':'text-gray-900'}`}>{editSpaceId ? 'Edit Space' : 'Add New Space'}</h1>
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6"/></button>
                            </div>
                            <form onSubmit={handleSubmitSpace} className={`rounded-2xl p-8 border shadow-sm space-y-6 ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className={`block text-[14px] font-medium mb-1.5 ${dk?'text-gray-300':'text-gray-700'}`}>Title</label>
                                        <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Downtown Office" className={`block w-full rounded-xl border py-3 px-4 text-[15px] outline-none ${dk?'bg-gray-700 border-gray-600 text-white':'bg-gray-50 border-gray-200'}`}/></div>
                                    <div className="relative" ref={locContainerRef}>
                                        <label className={`block text-[14px] font-medium mb-1.5 ${dk?'text-gray-300':'text-gray-700'}`}>Location</label>
                                        <input type="text" value={location} onChange={e=>handleLocationChange(e.target.value)} onFocus={()=>locationSuggestions.length>0&&setShowLocationSuggestions(true)} placeholder="e.g. New York" className={`block w-full rounded-xl border py-3 px-4 text-[15px] outline-none ${dk?'bg-gray-700 border-gray-600 text-white':'bg-gray-50 border-gray-200'}`}/>
                                        {showLocationSuggestions && locationSuggestions.length > 0 && (
                                            <div className={`absolute top-full left-0 right-0 mt-1 rounded-xl shadow-lg border z-50 overflow-hidden ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                                                {locationSuggestions.map((loc, i) => (
                                                    <button key={i} type="button" onClick={() => { setLocation(loc); setShowLocationSuggestions(false); }} className={`w-full text-left px-4 py-2.5 text-[14px] ${dk?'hover:bg-gray-700 text-gray-200':'hover:bg-gray-50 text-gray-700'} border-b last:border-b-0 ${dk?'border-gray-700':'border-gray-100'}`}>
                                                        <MapPin className="w-3.5 h-3.5 inline mr-2 text-gray-400"/>{loc}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className={`block text-[14px] font-medium mb-1.5 ${dk?'text-gray-300':'text-gray-700'}`}>Price ($/hr)</label>
                                        <input type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="50" min="1" className={`block w-full rounded-xl border py-3 px-4 text-[15px] outline-none ${dk?'bg-gray-700 border-gray-600 text-white':'bg-gray-50 border-gray-200'}`}/></div>
                                    <div><label className={`block text-[14px] font-medium mb-1.5 ${dk?'text-gray-300':'text-gray-700'}`}>Type</label>
                                        <select value={spaceType} onChange={e=>setSpaceType(e.target.value)} className={`block w-full rounded-xl border py-3 px-4 text-[15px] outline-none ${dk?'bg-gray-700 border-gray-600 text-white':'bg-gray-50 border-gray-200'}`}>
                                            <option value="room">Room</option><option value="office">Office</option><option value="storage">Storage</option><option value="event">Event</option>
                                        </select></div>
                                </div>
                                <div><label className={`block text-[14px] font-medium mb-1.5 ${dk?'text-gray-300':'text-gray-700'}`}>Description</label>
                                    <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe..." rows={3} className={`block w-full rounded-xl border py-3 px-4 text-[15px] outline-none resize-none ${dk?'bg-gray-700 border-gray-600 text-white':'bg-gray-50 border-gray-200'}`}/></div>
                                <button type="submit" disabled={submitting} className={`w-full flex items-center justify-center gap-2 text-white font-medium py-3 rounded-xl ${submitting?'bg-blue-400':'bg-blue-600 hover:bg-blue-700'}`}>
                                    <Plus className="w-4 h-4"/> {submitting ? (editSpaceId ? 'Updating...' : 'Adding...') : (editSpaceId ? 'Update Space' : 'Add Space')}
                                </button>
                            </form>
                        </div>
                    ) : activeTab === 'spaces' ? (
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h1 className={`text-[28px] font-bold ${dk?'text-white':'text-gray-900'}`}>My Spaces</h1>
                                <button onClick={()=>setShowForm(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[14px] font-medium"><Plus className="w-4 h-4"/>Add New</button>
                            </div>
                            {loading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin"/></div>
                            : spaces.length === 0 ? <div className={`rounded-2xl p-12 border shadow-sm text-center ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}><Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3"/><p className={dk?'text-gray-400':'text-gray-500'}>No spaces yet</p></div>
                            : <div className="space-y-4">{spaces.map(space=>(
                                <div key={space._id} className={`rounded-2xl p-6 border shadow-sm hover:shadow-md ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            {space.images?.length > 0 ? <img src={space.images[0]} alt="" className="w-20 h-20 object-cover rounded-xl shrink-0"/> : <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center shrink-0"><ImageIcon className="w-6 h-6 text-gray-300"/></div>}
                                            <div>
                                                <h3 className={`text-[18px] font-bold mb-1 ${dk?'text-white':'text-gray-900'}`}>{space.title}</h3>
                                                <div className="flex items-center gap-4 text-[14px] text-gray-500">
                                                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/>{space.location}</span>
                                                    <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4"/>${space.price}/hr</span>
                                                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${dk?'bg-gray-700 text-gray-300':'bg-gray-100 text-gray-600'}`}>{typeLabel[space.type]||space.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="bg-emerald-100/60 text-emerald-600 border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full">{space.availability?'Active':'Inactive'}</span>
                                            <button onClick={()=>openEditSpace(space)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4"/></button>
                                            <button onClick={()=>handleDeleteSpace(space._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                                        </div>
                                    </div>
                                </div>
                            ))}</div>}
                        </div>
                    ) : (
                        <>
                            <h1 className={`text-[28px] font-bold mb-6 ${dk?'text-white':'text-gray-900'}`}>My Profile</h1>
                            <div className={`rounded-2xl p-8 border shadow-sm max-w-2xl ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                                <div className={`flex items-center gap-6 mb-8 pb-8 border-b ${dk?'border-gray-700':'border-gray-100'}`}>
                                    <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[32px] font-bold">{user.name?user.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2):'U'}</div>
                                    <div>
                                        <h2 className={`text-[24px] font-bold ${dk?'text-white':'text-gray-900'}`}>{user.name}</h2>
                                        <p className="text-[15px] text-gray-500 mt-1">{user.email}</p>
                                        <span className="inline-block mt-3 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[12px] font-bold uppercase">{user.role}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div><label className="block text-[13px] font-bold text-gray-500 uppercase mb-2">Name</label><div className={`text-[16px] font-medium ${dk?'text-white':'text-gray-900'}`}>{user.name}</div></div>
                                    <div><label className="block text-[13px] font-bold text-gray-500 uppercase mb-2">Email</label><div className={`text-[16px] font-medium ${dk?'text-white':'text-gray-900'}`}>{user.email}</div></div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
            {chatBooking && <ChatWindow booking={chatBooking} currentUserId={user.id} onClose={()=>setChatBooking(null)}/>}
        </div>
    );
};

export default OwnerDashboard;
