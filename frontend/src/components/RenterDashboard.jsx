import React, { useEffect, useState } from 'react';
import {
    LayoutDashboard, Search, CalendarDays, LogOut, MapPin,
    DollarSign, Home, ChevronLeft, ChevronRight, Filter,
    Clock, CheckCircle2, XCircle, Loader2, ImageIcon, User,
    Heart, MessageCircle, Map, CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import DarkModeToggle from './DarkModeToggle';
import NotificationBell from './NotificationBell';
import SearchAutocomplete from './SearchAutocomplete';
import { ReviewSection } from './ReviewSection';
import ChatWindow from './ChatWindow';
import MapView from './MapView';

const API = 'http://localhost:5000/api';

const RenterDashboard = () => {
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const dk = darkMode;
    const [activeTab, setActiveTab] = useState('browse');
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

    const [filterLocation, setFilterLocation] = useState('');
    const [filterMinPrice, setFilterMinPrice] = useState('');
    const [filterMaxPrice, setFilterMaxPrice] = useState('');
    const [filterType, setFilterType] = useState('');

    const [bookingModal, setBookingModal] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);

    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);

    // New feature state
    const [favorites, setFavorites] = useState([]);
    const [favIds, setFavIds] = useState(new Set());
    const [favLoading, setFavLoading] = useState(false);
    const [chatBooking, setChatBooking] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [payingBooking, setPayingBooking] = useState(null);
    const [payLoading, setPayLoading] = useState(false);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        fetchSpaces(1);
        fetchBookings();
    }, []);

    const fetchSpaces = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 9 });
            if (filterLocation) params.append('location', filterLocation);
            if (filterMinPrice) params.append('minPrice', filterMinPrice);
            if (filterMaxPrice) params.append('maxPrice', filterMaxPrice);
            if (filterType) params.append('type', filterType);

            const res = await fetch(`${API}/spaces?${params}`);
            const data = await res.json();
            if (res.ok) {
                setSpaces(data.spaces);
                setPagination(data.pagination);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleFilter = (e) => {
        e.preventDefault();
        fetchSpaces(1);
    };

    const clearFilters = () => {
        setFilterLocation(''); setFilterMinPrice(''); setFilterMaxPrice(''); setFilterType('');
        setTimeout(() => fetchSpaces(1), 0);
    };

    const handleBook = async () => {
        if (!startDate || !endDate) { toast.error('Please select start and end dates'); return; }
        setBookingLoading(true);
        try {
            const res = await fetch(`${API}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ spaceId: bookingModal._id, startDate, endDate })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            toast.success('Booking request submitted!');
            setBookingModal(null); setStartDate(''); setEndDate('');
        } catch (err) { toast.error(err.message || 'Booking failed'); }
        finally { setBookingLoading(false); }
    };

    const fetchBookings = async () => {
        setBookingsLoading(true);
        try {
            const res = await fetch(`${API}/bookings/user`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setBookings(data);
        } catch (err) { console.error(err); }
        finally { setBookingsLoading(false); }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Favorites
    const fetchFavorites = async () => {
        setFavLoading(true);
        try {
            const res = await fetch(`${API}/favorites/user`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (res.ok) { setFavorites(data); setFavIds(new Set(data.map(f => f.spaceId?._id))); }
        } catch (e) { console.error(e); }
        setFavLoading(false);
    };

    const toggleFav = async (spaceId) => {
        if (favIds.has(spaceId)) {
            const fav = favorites.find(f => f.spaceId?._id === spaceId);
            if (!fav) return;
            try {
                await fetch(`${API}/favorites/${fav._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                setFavIds(prev => { const n = new Set(prev); n.delete(spaceId); return n; });
                setFavorites(prev => prev.filter(f => f._id !== fav._id));
                toast.success('Removed from favorites');
            } catch (e) { toast.error('Failed'); }
        } else {
            try {
                const res = await fetch(`${API}/favorites`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ spaceId })
                });
                if (res.ok) { setFavIds(prev => new Set(prev).add(spaceId)); toast.success('Added to favorites'); fetchFavorites(); }
            } catch (e) { toast.error('Failed'); }
        }
    };

    const handlePay = async (bookingId) => {
        setPayLoading(true);
        try {
            const res = await fetch(`${API}/payments/${bookingId}`, {
                method: 'POST', headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) { toast.success(`Payment of $${data.paymentDetails.amount} successful!`); setPayingBooking(null); fetchBookings(); }
            else toast.error(data.message);
        } catch (e) { toast.error('Payment failed'); }
        setPayLoading(false);
    };

    useEffect(() => { if (token) fetchFavorites(); }, []);

    const statusBadge = (status) => {
        const styles = {
            pending: 'bg-amber-50 text-amber-600 border-amber-200',
            approved: 'bg-emerald-50 text-emerald-600 border-emerald-200',
            rejected: 'bg-red-50 text-red-600 border-red-200'
        };
        const icons = { pending: <Clock className="w-3 h-3" />, approved: <CheckCircle2 className="w-3 h-3" />, rejected: <XCircle className="w-3 h-3" /> };
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${styles[status]}`}>
                {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const typeLabel = { room: '🏠 Room', office: '🏢 Office', storage: '📦 Storage', event: '🎉 Event' };

    return (
        <div className={`flex h-screen font-sans overflow-hidden ${dk ? 'bg-gray-900' : 'bg-[#F8FAFC]'}`}>
            {/* Sidebar */}
            <aside className={`w-[280px] border-r flex flex-col justify-between shrink-0 h-full ${dk ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div>
                    <div className="px-8 py-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                            <Home className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className={`text-[20px] font-bold leading-none block tracking-tight ${dk ? 'text-white' : 'text-gray-900'}`}>SpaceShare</span>
                            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mt-1 block">Renter Portal</span>
                        </div>
                    </div>
                    <nav className="px-5 mt-4 space-y-1.5">
                        {[{key:'browse',icon:LayoutDashboard,label:'Browse Spaces',fn:()=>{setActiveTab('browse');fetchSpaces(1);}},
                          {key:'bookings',icon:CalendarDays,label:'My Bookings',fn:()=>{setActiveTab('bookings');fetchBookings();}},
                          {key:'favorites',icon:Heart,label:'My Favorites',fn:()=>{setActiveTab('favorites');fetchFavorites();}},
                          {key:'map',icon:Map,label:'Map View',fn:()=>{setActiveTab('map');fetchSpaces(1);}},
                          {key:'profile',icon:User,label:'My Profile',fn:()=>setActiveTab('profile')}].map(item=>(
                            <button key={item.key} onClick={item.fn} className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-[14.5px] transition-colors w-full ${activeTab === item.key ? (dk?'bg-blue-900/30 text-blue-400':'bg-blue-50/50 text-blue-600') : (dk?'text-gray-400 hover:text-white hover:bg-gray-700':'text-gray-500 hover:text-gray-900 hover:bg-gray-50')}`}>
                                <item.icon className="w-[20px] h-[20px]" /> {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="p-5">
                    <button onClick={handleLogout} className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-[14.5px] transition-colors w-full ${dk?'text-red-400 hover:bg-red-900/20':'text-red-500 hover:bg-red-50 hover:text-red-600'}`}>
                        <LogOut className="w-[20px] h-[20px]" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-10 py-10">
                {/* Top Bar */}
                <div className="flex items-center justify-between mb-6 max-w-[1200px] mx-auto">
                    <div className="w-80"><SearchAutocomplete onSelect={(s) => { setFilterLocation(s.location); fetchSpaces(1); }} /></div>
                    <div className="flex items-center gap-3">
                        <NotificationBell />
                        <DarkModeToggle />
                    </div>
                </div>
                <div className="max-w-[1200px] mx-auto">
                    {activeTab === 'browse' ? (
                        <>
                            <header className="mb-8">
                                <h1 className={`text-[32px] font-extrabold tracking-tight mb-2 ${dk?'text-white':'text-gray-900'}`}>Find your space</h1>
                                <p className={`text-[16px] font-medium ${dk?'text-gray-400':'text-gray-500'}`}>Browse available spaces and book the one that fits your needs.</p>
                            </header>

                            {/* Filter Bar */}
                            <form onSubmit={handleFilter} className={`rounded-2xl p-5 border shadow-sm mb-8 ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <Filter className="w-4 h-4 text-gray-400" />
                                    <span className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Filters</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                                    <input type="text" placeholder="Location..." value={filterLocation} onChange={e => setFilterLocation(e.target.value)}
                                        className="rounded-xl bg-gray-50/50 border border-gray-200 py-2.5 px-4 text-[14px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all" />
                                    <input type="number" placeholder="Min price" value={filterMinPrice} onChange={e => setFilterMinPrice(e.target.value)} min="0"
                                        className="rounded-xl bg-gray-50/50 border border-gray-200 py-2.5 px-4 text-[14px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all" />
                                    <input type="number" placeholder="Max price" value={filterMaxPrice} onChange={e => setFilterMaxPrice(e.target.value)} min="0"
                                        className="rounded-xl bg-gray-50/50 border border-gray-200 py-2.5 px-4 text-[14px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all" />
                                    <select value={filterType} onChange={e => setFilterType(e.target.value)}
                                        className="rounded-xl bg-gray-50/50 border border-gray-200 py-2.5 px-4 text-[14px] text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all">
                                        <option value="">All Types</option>
                                        <option value="room">Room</option>
                                        <option value="office">Office</option>
                                        <option value="storage">Storage</option>
                                        <option value="event">Event</option>
                                    </select>
                                    <div className="flex gap-2">
                                        <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 text-[14px] font-semibold transition-colors">Search</button>
                                        <button type="button" onClick={clearFilters} className="px-3 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl text-[13px] font-medium transition-colors">Clear</button>
                                    </div>
                                </div>
                            </form>

                            {/* Space Grid */}
                            {loading ? (
                                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
                            ) : spaces.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"><Search className="w-7 h-7 text-gray-300" /></div>
                                    <p className="text-[16px] font-medium text-gray-500 mb-2">No spaces found</p>
                                    <p className="text-[14px] text-gray-400">Try adjusting your filters or check back later.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {spaces.map((space) => (
                                            <div key={space._id} className={`rounded-[20px] border shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                                                {space.images && space.images.length > 0 ? (
                                                    <img src={space.images[0]} alt={space.title} className="w-full h-44 object-cover" />
                                                ) : (
                                                    <div className="w-full h-44 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                                                        <ImageIcon className="w-10 h-10 text-gray-300" />
                                                    </div>
                                                )}
                                                <div className="p-5 flex flex-col flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className={`text-[16px] font-bold leading-tight pr-3 ${dk?'text-white':'text-gray-900'}`}>{space.title}</h3>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <button onClick={() => toggleFav(space._id)} className="p-1 rounded-lg hover:bg-red-50 transition-colors">
                                                                <Heart className={`w-4 h-4 ${favIds.has(space._id) ? 'fill-red-500 text-red-500' : dk?'text-gray-500':'text-gray-400'}`} />
                                                            </button>
                                                            <div className="text-right">
                                                                <div className={`text-[18px] font-bold leading-none ${dk?'text-white':'text-gray-900'}`}>${space.price}</div>
                                                                <div className="text-[11px] text-gray-400 font-medium">per hour</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-[12px] text-gray-500 mb-2">
                                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" />{space.location}</span>
                                                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${dk?'bg-gray-700 text-gray-300':'bg-gray-100 text-gray-600'}`}>{typeLabel[space.type] || space.type}</span>
                                                    </div>
                                                    {space.description && <p className={`text-[13px] line-clamp-2 leading-relaxed mb-2 ${dk?'text-gray-400':'text-gray-500'}`}>{space.description}</p>}
                                                    <ReviewSection spaceId={space._id} darkMode={dk} token={token} hasBooked={bookings.some(b => (b.spaceId?._id || b.spaceId) === space._id && b.status === 'approved')} />
                                                    <div className="mt-auto pt-3 border-t border-gray-100">
                                                        <button onClick={() => setBookingModal(space)} className="w-full py-2.5 rounded-xl text-[14px] font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                                                            Book Now
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {pagination.totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-3 mt-8">
                                            <button onClick={() => fetchSpaces(pagination.currentPage - 1)} disabled={pagination.currentPage <= 1}
                                                className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                                <ChevronLeft className="w-4 h-4" /> Prev
                                            </button>
                                            <span className="text-[13px] font-semibold text-gray-500">
                                                Page {pagination.currentPage} of {pagination.totalPages}
                                            </span>
                                            <button onClick={() => fetchSpaces(pagination.currentPage + 1)} disabled={pagination.currentPage >= pagination.totalPages}
                                                className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                                Next <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    ) : activeTab === 'bookings' ? (
                        <>
                            <header className="mb-8">
                                <h1 className={`text-[32px] font-extrabold tracking-tight mb-2 ${dk?'text-white':'text-gray-900'}`}>My Bookings</h1>
                                <p className={`text-[16px] font-medium ${dk?'text-gray-400':'text-gray-500'}`}>Track the status of your booking requests.</p>
                            </header>
                            {bookingsLoading ? (
                                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
                            ) : bookings.length === 0 ? (
                                <div className={`rounded-2xl p-12 border shadow-sm text-center ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                                    <p className={`text-[16px] font-medium mb-2 ${dk?'text-gray-400':'text-gray-500'}`}>No bookings yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {bookings.map((b) => (
                                        <div key={b._id} className={`rounded-2xl p-6 border shadow-sm ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className={`text-[17px] font-bold mb-1 ${dk?'text-white':'text-gray-900'}`}>{b.spaceId?.title || 'Space'}</h3>
                                                    <div className="flex items-center gap-4 text-[13px] text-gray-500 mb-2">
                                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{b.spaceId?.location}</span>
                                                        <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />${b.spaceId?.price}/hr</span>
                                                    </div>
                                                    <div className="text-[13px] text-gray-500">
                                                        <span className="font-medium">Time:</span> {new Date(b.startDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })} — {new Date(b.endDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    {statusBadge(b.status)}
                                                    {b.paymentStatus === 'paid' && <span className="text-[11px] font-bold text-emerald-500">💰 Paid ${b.paymentAmount}</span>}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                                <button onClick={() => setChatBooking(b)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${dk?'bg-gray-700 text-gray-300 hover:bg-gray-600':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                                    <MessageCircle className="w-3.5 h-3.5" /> Chat
                                                </button>
                                                {b.status === 'approved' && b.paymentStatus !== 'paid' && (
                                                    <button onClick={() => handlePay(b._id)} disabled={payLoading}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50">
                                                        <CreditCard className="w-3.5 h-3.5" /> {payLoading ? 'Processing...' : 'Pay Now'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : activeTab === 'favorites' ? (
                        <>
                            <header className="mb-8">
                                <h1 className={`text-[32px] font-extrabold tracking-tight mb-2 ${dk?'text-white':'text-gray-900'}`}>My Favorites</h1>
                                <p className={`text-[16px] font-medium ${dk?'text-gray-400':'text-gray-500'}`}>Spaces you've saved for later.</p>
                            </header>
                            {favLoading ? (
                                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
                            ) : favorites.length === 0 ? (
                                <div className={`rounded-2xl p-12 border shadow-sm text-center ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                                    <Heart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                    <p className={`text-[16px] font-medium ${dk?'text-gray-400':'text-gray-500'}`}>No favorites yet</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {favorites.map(f => f.spaceId && (
                                        <div key={f._id} className={`rounded-[20px] border shadow-sm p-5 ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className={`text-[16px] font-bold ${dk?'text-white':'text-gray-900'}`}>{f.spaceId.title}</h3>
                                                <button onClick={() => toggleFav(f.spaceId._id)} className="p-1"><Heart className="w-4 h-4 fill-red-500 text-red-500" /></button>
                                            </div>
                                            <div className="flex items-center gap-3 text-[12px] text-gray-500 mb-2">
                                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{f.spaceId.location}</span>
                                                <span className="font-semibold">${f.spaceId.price}/hr</span>
                                            </div>
                                            <button onClick={() => { setBookingModal(f.spaceId); setActiveTab('browse'); }} className="w-full mt-2 py-2 rounded-xl text-[13px] font-semibold bg-blue-600 text-white hover:bg-blue-700">Book Now</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : activeTab === 'map' ? (
                        <>
                            <header className="mb-8">
                                <h1 className={`text-[32px] font-extrabold tracking-tight mb-2 ${dk?'text-white':'text-gray-900'}`}>Map View</h1>
                                <p className={`text-[16px] font-medium ${dk?'text-gray-400':'text-gray-500'}`}>Explore spaces on the map.</p>
                            </header>
                            <MapView spaces={spaces} darkMode={dk} onSelectSpace={(s) => setBookingModal(s)} />
                        </>
                    ) : (
                        <>
                            <header className="mb-8">
                                <h1 className={`text-[32px] font-extrabold tracking-tight mb-2 ${dk?'text-white':'text-gray-900'}`}>My Profile</h1>
                            </header>
                            <div className={`rounded-2xl p-8 border shadow-sm max-w-2xl ${dk?'bg-gray-800 border-gray-700':'bg-white border-gray-100'}`}>
                                <div className={`flex items-center gap-6 mb-8 pb-8 border-b ${dk?'border-gray-700':'border-gray-100'}`}>
                                    <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[32px] font-bold">
                                        {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                                    </div>
                                    <div>
                                        <h2 className={`text-[24px] font-bold ${dk?'text-white':'text-gray-900'}`}>{user.name || 'User'}</h2>
                                        <p className="text-[15px] text-gray-500 mt-1">{user.email}</p>
                                        <span className="inline-block mt-3 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[12px] font-bold uppercase">{user.role}</span>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div><label className="block text-[13px] font-bold text-gray-500 uppercase mb-2">Full Name</label><div className={`text-[16px] font-medium ${dk?'text-white':'text-gray-900'}`}>{user.name||'N/A'}</div></div>
                                    <div><label className="block text-[13px] font-bold text-gray-500 uppercase mb-2">Email</label><div className={`text-[16px] font-medium ${dk?'text-white':'text-gray-900'}`}>{user.email||'N/A'}</div></div>
                                </div>
                            </div>
                        </>
                    )}
                    <div className="h-10"></div>
                </div>
            </main>
            {bookingModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className={`rounded-2xl p-8 w-full max-w-md shadow-2xl ${dk?'bg-gray-800':'bg-white'}`}>
                        <h2 className={`text-[22px] font-bold mb-1 ${dk?'text-white':'text-gray-900'}`}>Book Space</h2>
                        <p className="text-[14px] text-gray-500 mb-6">{bookingModal.title} — ${bookingModal.price}/hr</p>
                        <div className="space-y-4">
                            <div><label className={`block text-[14px] font-medium mb-1.5 ${dk?'text-gray-300':'text-gray-700'}`}>Start Date & Time</label>
                                <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} className={`block w-full rounded-xl border py-3 px-4 text-[15px] outline-none ${dk?'bg-gray-700 border-gray-600 text-white':'bg-gray-50 border-gray-200'}`} /></div>
                            <div><label className={`block text-[14px] font-medium mb-1.5 ${dk?'text-gray-300':'text-gray-700'}`}>End Date & Time</label>
                                <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} className={`block w-full rounded-xl border py-3 px-4 text-[15px] outline-none ${dk?'bg-gray-700 border-gray-600 text-white':'bg-gray-50 border-gray-200'}`} /></div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => { setBookingModal(null); setStartDate(''); setEndDate(''); }} className={`flex-1 py-2.5 rounded-xl border font-medium text-[14px] ${dk?'border-gray-600 text-gray-300':'border-gray-200 text-gray-600'}`}>Cancel</button>
                            <button onClick={handleBook} disabled={bookingLoading} className={`flex-1 py-2.5 rounded-xl text-white font-semibold text-[14px] ${bookingLoading?'bg-blue-400':'bg-blue-600 hover:bg-blue-700'}`}>{bookingLoading?'Submitting...':'Confirm Booking'}</button>
                        </div>
                    </div>
                </div>
            )}
            {chatBooking && <ChatWindow booking={chatBooking} currentUserId={user.id} onClose={() => setChatBooking(null)} />}
        </div>
    );
};

export default RenterDashboard;

