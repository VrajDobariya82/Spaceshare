import React, { useEffect, useState } from 'react';
import {
    LayoutDashboard,
    Search,
    CalendarDays,
    LogOut,
    MapPin,
    DollarSign,
    Home,
    ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const API = 'http://localhost:5000/api';

const RenterDashboard = () => {
    const navigate = useNavigate();
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingId, setBookingId] = useState(null); // tracks which space is being booked

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchSpaces();
    }, []);

    const fetchSpaces = async () => {
        try {
            const res = await fetch(`${API}/spaces`);
            const data = await res.json();
            if (res.ok) {
                setSpaces(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (spaceId) => {
        setBookingId(spaceId);
        try {
            const res = await fetch(`${API}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ spaceId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            toast.success('🎉 Booking confirmed!');
        } catch (err) {
            toast.error(err.message || 'Booking failed');
        } finally {
            setBookingId(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col justify-between shrink-0 h-full">
                <div>
                    {/* Logo */}
                    <div className="px-8 py-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                            <Home className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="text-[20px] font-bold text-gray-900 leading-none block tracking-tight">SpaceShare</span>
                            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mt-1 block">Renter Portal</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="px-5 mt-4 space-y-1.5">
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 bg-blue-50/50 text-blue-600 rounded-xl font-semibold text-[14.5px] transition-colors">
                            <LayoutDashboard className="w-[20px] h-[20px]" />
                            Browse Spaces
                        </a>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14.5px] transition-colors">
                            <CalendarDays className="w-[20px] h-[20px]" />
                            My Bookings
                        </a>
                    </nav>
                </div>

                {/* Logout */}
                <div className="p-5">
                    <button onClick={handleLogout} className="flex items-center gap-3.5 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium text-[14.5px] transition-colors w-full">
                        <LogOut className="w-[20px] h-[20px]" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-10 py-10">
                <div className="max-w-[1200px] mx-auto">

                    {/* Header */}
                    <header className="mb-10">
                        <h1 className="text-[32px] font-extrabold text-gray-900 tracking-tight mb-2">Find your space</h1>
                        <p className="text-[16px] text-gray-500 font-medium">Browse available spaces and book the one that fits your needs.</p>
                    </header>

                    {/* Space Grid */}
                    {loading ? (
                        <div className="text-center py-20 text-gray-400 text-[15px]">Loading spaces...</div>
                    ) : spaces.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-7 h-7 text-gray-300" />
                            </div>
                            <p className="text-[16px] font-medium text-gray-500 mb-2">No spaces available yet</p>
                            <p className="text-[14px] text-gray-400">Check back later — owners are adding new spaces all the time!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {spaces.map((space) => (
                                <div key={space._id} className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                                    {/* Title & Price */}
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-[17px] font-bold text-gray-900 leading-tight pr-3">{space.title}</h3>
                                        <div className="text-right shrink-0">
                                            <div className="text-[20px] font-bold text-gray-900 leading-none">${space.price}</div>
                                            <div className="text-[11px] text-gray-400 font-medium">per hour</div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center gap-1.5 text-[13.5px] text-gray-500 mb-3">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {space.location}
                                    </div>

                                    {/* Description */}
                                    {space.description && (
                                        <p className="text-[13.5px] text-gray-500 line-clamp-2 leading-relaxed mb-4">{space.description}</p>
                                    )}

                                    {/* Book Button */}
                                    <div className="mt-auto pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => handleBook(space._id)}
                                            disabled={bookingId === space._id}
                                            className={`w-full py-2.5 rounded-xl text-[14px] font-semibold transition-colors ${bookingId === space._id
                                                    ? 'bg-blue-400 text-white cursor-not-allowed'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                }`}
                                        >
                                            {bookingId === space._id ? 'Booking...' : '🏠 Book Now'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="h-10"></div>
                </div>
            </main>
        </div>
    );
};

export default RenterDashboard;
