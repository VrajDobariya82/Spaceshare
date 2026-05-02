import React, { useEffect, useState } from 'react';
import {
    LayoutDashboard, Search, CalendarDays, LogOut, MapPin,
    DollarSign, Home, ChevronLeft, ChevronRight, Filter,
    Clock, CheckCircle2, XCircle, Loader2, ImageIcon, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const API = 'http://localhost:5000/api';

const RenterDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('browse');
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

    // Filter state
    const [filterLocation, setFilterLocation] = useState('');
    const [filterMinPrice, setFilterMinPrice] = useState('');
    const [filterMaxPrice, setFilterMaxPrice] = useState('');
    const [filterType, setFilterType] = useState('');

    // Booking modal state
    const [bookingModal, setBookingModal] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);

    // Booking history
    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        fetchSpaces(1);
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
        <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col justify-between shrink-0 h-full">
                <div>
                    <div className="px-8 py-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                            <Home className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="text-[20px] font-bold text-gray-900 leading-none block tracking-tight">SpaceShare</span>
                            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mt-1 block">Renter Portal</span>
                        </div>
                    </div>
                    <nav className="px-5 mt-4 space-y-1.5">
                        <button onClick={() => { setActiveTab('browse'); fetchSpaces(1); }} className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-[14.5px] transition-colors w-full ${activeTab === 'browse' ? 'bg-blue-50/50 text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                            <LayoutDashboard className="w-[20px] h-[20px]" /> Browse Spaces
                        </button>
                        <button onClick={() => { setActiveTab('bookings'); fetchBookings(); }} className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-[14.5px] transition-colors w-full ${activeTab === 'bookings' ? 'bg-blue-50/50 text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                            <CalendarDays className="w-[20px] h-[20px]" /> My Bookings
                        </button>
                        <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-[14.5px] transition-colors w-full ${activeTab === 'profile' ? 'bg-blue-50/50 text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                            <User className="w-[20px] h-[20px]" /> My Profile
                        </button>
                    </nav>
                </div>
                <div className="p-5">
                    <button onClick={handleLogout} className="flex items-center gap-3.5 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium text-[14.5px] transition-colors w-full">
                        <LogOut className="w-[20px] h-[20px]" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-10 py-10">
                <div className="max-w-[1200px] mx-auto">
                    {activeTab === 'browse' ? (
                        <>
                            <header className="mb-8">
                                <h1 className="text-[32px] font-extrabold text-gray-900 tracking-tight mb-2">Find your space</h1>
                                <p className="text-[16px] text-gray-500 font-medium">Browse available spaces and book the one that fits your needs.</p>
                            </header>

                            {/* Filter Bar */}
                            <form onSubmit={handleFilter} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-8">
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
                                            <div key={space._id} className="bg-white rounded-[20px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                                                {/* Image */}
                                                {space.images && space.images.length > 0 ? (
                                                    <img src={space.images[0]} alt={space.title} className="w-full h-44 object-cover" />
                                                ) : (
                                                    <div className="w-full h-44 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                                                        <ImageIcon className="w-10 h-10 text-gray-300" />
                                                    </div>
                                                )}
                                                <div className="p-5 flex flex-col flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="text-[16px] font-bold text-gray-900 leading-tight pr-3">{space.title}</h3>
                                                        <div className="text-right shrink-0">
                                                            <div className="text-[18px] font-bold text-gray-900 leading-none">${space.price}</div>
                                                            <div className="text-[11px] text-gray-400 font-medium">per hour</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-[12px] text-gray-500 mb-2">
                                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" />{space.location}</span>
                                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-[11px] font-semibold">{typeLabel[space.type] || space.type}</span>
                                                    </div>
                                                    {space.description && <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed mb-3">{space.description}</p>}
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
                        /* ==================== MY BOOKINGS ==================== */
                        <>
                            <header className="mb-8">
                                <h1 className="text-[32px] font-extrabold text-gray-900 tracking-tight mb-2">My Bookings</h1>
                                <p className="text-[16px] text-gray-500 font-medium">Track the status of your booking requests.</p>
                            </header>
                            {bookingsLoading ? (
                                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
                            ) : bookings.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"><CalendarDays className="w-7 h-7 text-gray-300" /></div>
                                    <p className="text-[16px] font-medium text-gray-500 mb-2">No bookings yet</p>
                                    <p className="text-[14px] text-gray-400">Browse spaces and make your first booking!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {bookings.map((b) => (
                                        <div key={b._id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-[17px] font-bold text-gray-900 mb-1">{b.spaceId?.title || 'Space'}</h3>
                                                    <div className="flex items-center gap-4 text-[13px] text-gray-500 mb-2">
                                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{b.spaceId?.location}</span>
                                                        <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />${b.spaceId?.price}/hr</span>
                                                    </div>
                                                    <div className="text-[13px] text-gray-500">
                                                        <span className="font-medium">Dates:</span> {new Date(b.startDate).toLocaleDateString()} — {new Date(b.endDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                {statusBadge(b.status)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
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
                    <div className="h-10"></div>
                </div>
            </main>

            {/* Booking Modal */}
            {bookingModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <h2 className="text-[22px] font-bold text-gray-900 mb-1">Book Space</h2>
                        <p className="text-[14px] text-gray-500 mb-6">{bookingModal.title} — ${bookingModal.price}/hr</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Start Date</label>
                                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                                    className="block w-full rounded-xl bg-gray-50/50 border border-gray-200 py-3 px-4 text-[15px] text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-[14px] font-medium text-gray-700 mb-1.5">End Date</label>
                                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                                    className="block w-full rounded-xl bg-gray-50/50 border border-gray-200 py-3 px-4 text-[15px] text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all" />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => { setBookingModal(null); setStartDate(''); setEndDate(''); }}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-[14px] hover:bg-gray-50 transition-colors">Cancel</button>
                            <button onClick={handleBook} disabled={bookingLoading}
                                className={`flex-1 py-2.5 rounded-xl text-white font-semibold text-[14px] transition-colors ${bookingLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {bookingLoading ? 'Submitting...' : 'Confirm Booking'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RenterDashboard;
