import React, { useEffect, useState } from 'react';
import {
    LayoutDashboard,
    Search,
    CalendarDays,
    MessageSquare,
    Star,
    Settings,
    LogOut,
    MapPin,
    DollarSign,
    Home,
    SlidersHorizontal,
    ThumbsUp,
    Heart,
    Wifi,
    Users,
    Camera,
    Sun,
    VolumeX,
    Clock,
    ChevronRight,
    ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RenterDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: 'Alex Morgan', role: 'Pro Renter' });

    useEffect(() => {
        // Here you would normally fetch the user details using the token
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col justify-between shrink-0 h-full">
                <div>
                    {/* Logo Section */}
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
                            Dashboard
                        </a>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14.5px] transition-colors">
                            <Search className="w-[20px] h-[20px]" />
                            Search Spaces
                        </a>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14.5px] transition-colors">
                            <CalendarDays className="w-[20px] h-[20px]" />
                            My Bookings
                        </a>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14.5px] transition-colors relative">
                            <MessageSquare className="w-[20px] h-[20px]" />
                            Messages
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></span>
                        </a>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14.5px] transition-colors">
                            <Star className="w-[20px] h-[20px]" />
                            Reviews
                        </a>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14.5px] transition-colors">
                            <Settings className="w-[20px] h-[20px]" />
                            Settings
                        </a>
                    </nav>
                </div>

                {/* Bottom Section */}
                <div>
                    <div className="px-5 mb-4">
                        <button onClick={handleLogout} className="flex items-center gap-3.5 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium text-[14.5px] transition-colors w-full">
                            <LogOut className="w-[20px] h-[20px]" />
                            Logout
                        </button>
                    </div>
                    <div className="border-t border-gray-100 p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <img src="https://i.pravatar.cc/150?img=68" alt="User Avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                            <div>
                                <h4 className="text-[14px] font-bold text-gray-900">{user.name}</h4>
                                <p className="text-[12px] text-gray-500 font-medium">{user.role}</p>
                            </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-10 py-10">
                <div className="max-w-[1200px] mx-auto">

                    {/* Header */}
                    <header className="mb-10">
                        <h1 className="text-[32px] font-extrabold text-gray-900 tracking-tight mb-2">Find your space</h1>
                        <p className="text-[16px] text-gray-500 font-medium">Welcome back, {user.name.split(' ')[0]}! What are you looking for today?</p>
                    </header>

                    {/* Search Area */}
                    <div className="bg-white rounded-2xl p-2.5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center mb-6">
                        <div className="flex-1 flex items-center px-4 pl-4 border-r border-gray-100">
                            <Search className="w-5 h-5 text-blue-600 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search by location, space type, or keywords..."
                                className="w-full pl-3 py-3 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
                            />
                        </div>
                        <div className="w-[200px] px-4 flex items-center justify-between cursor-pointer group">
                            <span className="text-[14.5px] text-gray-500 font-medium group-hover:text-gray-900 transition-colors">Add dates</span>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 px-8 rounded-xl transition-colors text-[14.5px]">
                            Search
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-2 scrollbar-none">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-[13.5px] font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all whitespace-nowrap shadow-sm">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            Location
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-[13.5px] font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all whitespace-nowrap shadow-sm">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            Price Range
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-[13.5px] font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all whitespace-nowrap shadow-sm">
                            <Home className="w-4 h-4 text-gray-500" />
                            Space Type
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
                        </button>
                        <div className="flex-1"></div>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full text-[13.5px] font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all whitespace-nowrap shadow-sm">
                            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                            More Filters
                        </button>
                    </div>

                    {/* Recommended Spaces */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                <ThumbsUp className="w-4 h-4" />
                            </div>
                            <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">Recommended Spaces</h2>
                        </div>
                        <a href="#" className="flex items-center gap-1 text-[14px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                            View all <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Grid of cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {/* Card 1 */}
                        <div className="bg-white rounded-[20px] p-2.5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                            <div className="relative rounded-[14px] overflow-hidden h-[200px] mb-4">
                                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Space" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur pb-0 px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                                    <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                                    <span className="text-[12px] font-bold text-gray-900">4.9</span>
                                </div>
                                <button className="absolute top-3 right-3 w-8 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/50 transition-colors">
                                    <Heart className="w-4 h-4 text-white" />
                                </button>
                                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                                    <span className="bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm tracking-wide">Office</span>
                                    <span className="text-white text-[11px] font-medium drop-shadow-md flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded backdrop-blur-sm">
                                        <div className="w-1 h-1 bg-white rounded-full"></div> Downtown District
                                    </span>
                                </div>
                            </div>
                            <div className="px-2 pb-2 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2 mt-1">
                                    <h3 className="text-[17px] font-bold text-gray-900 leading-tight pr-4">Downtown Co-working Desk</h3>
                                    <div className="text-right shrink-0">
                                        <div className="text-[18px] font-bold text-gray-900 leading-none">$25</div>
                                        <div className="text-[11px] text-gray-400 font-medium">per hour</div>
                                    </div>
                                </div>
                                <p className="text-[13.5px] text-gray-500 line-clamp-2 leading-relaxed mb-5">
                                    A vibrant open workspace located in the heart of the financial district. Lots of natural light and high-speed internet.
                                </p>
                                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex items-center gap-1 text-gray-400 feature-icon bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                            <Wifi className="w-[14px] h-[14px]" /> <span className="text-[11px] font-semibold text-gray-600">Wifi</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-400 feature-icon bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                            <Users className="w-[14px] h-[14px]" /> <span className="text-[11px] font-semibold text-gray-600">4</span>
                                        </div>
                                    </div>
                                    <button className="text-[13.5px] font-bold text-blue-600 hover:text-blue-700 transition-colors">Book Now</button>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white rounded-[20px] p-2.5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                            <div className="relative rounded-[14px] overflow-hidden h-[200px] mb-4">
                                <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Space" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur pb-0 px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                                    <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                                    <span className="text-[12px] font-bold text-gray-900">4.8</span>
                                </div>
                                <button className="absolute top-3 right-3 w-8 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/50 transition-colors">
                                    <Heart className="w-4 h-4 text-white" />
                                </button>
                                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                                    <span className="bg-pink-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm tracking-wide">Studio</span>
                                    <span className="text-white text-[11px] font-medium drop-shadow-md flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded backdrop-blur-sm">
                                        <div className="w-1 h-1 bg-white rounded-full"></div> Arts District
                                    </span>
                                </div>
                            </div>
                            <div className="px-2 pb-2 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2 mt-1">
                                    <h3 className="text-[17px] font-bold text-gray-900 leading-tight pr-4">Bright Photo Studio</h3>
                                    <div className="text-right shrink-0">
                                        <div className="text-[18px] font-bold text-gray-900 leading-none">$60</div>
                                        <div className="text-[11px] text-gray-400 font-medium">per hour</div>
                                    </div>
                                </div>
                                <p className="text-[13.5px] text-gray-500 line-clamp-2 leading-relaxed mb-5">
                                    Perfect for portrait and product photography. Includes backdrops, lighting equipment, and dressing area.
                                </p>
                                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex items-center gap-1 text-gray-400 feature-icon bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                            <Camera className="w-[14px] h-[14px]" /> <span className="text-[11px] font-semibold text-gray-600">Gear</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-400 feature-icon bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                            <Sun className="w-[14px] h-[14px]" /> <span className="text-[11px] font-semibold text-gray-600">Light</span>
                                        </div>
                                    </div>
                                    <button className="text-[13.5px] font-bold text-blue-600 hover:text-blue-700 transition-colors">Book Now</button>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white rounded-[20px] p-2.5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                            <div className="relative rounded-[14px] overflow-hidden h-[200px] mb-4">
                                <img src="https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Space" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur pb-0 px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                                    <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                                    <span className="text-[12px] font-bold text-gray-900">5.0</span>
                                </div>
                                <button className="absolute top-3 right-3 w-8 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/50 transition-colors">
                                    <Heart className="w-4 h-4 text-white" />
                                </button>
                                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                                    <span className="bg-indigo-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm tracking-wide">Meeting</span>
                                    <span className="text-white text-[11px] font-medium drop-shadow-md flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded backdrop-blur-sm">
                                        <div className="w-1 h-1 bg-white rounded-full"></div> Tech Park
                                    </span>
                                </div>
                            </div>
                            <div className="px-2 pb-2 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2 mt-1">
                                    <h3 className="text-[17px] font-bold text-gray-900 leading-tight pr-4">Quiet Meeting Room</h3>
                                    <div className="text-right shrink-0">
                                        <div className="text-[18px] font-bold text-gray-900 leading-none">$40</div>
                                        <div className="text-[11px] text-gray-400 font-medium">per hour</div>
                                    </div>
                                </div>
                                <p className="text-[13.5px] text-gray-500 line-clamp-2 leading-relaxed mb-5">
                                    Soundproof meeting space ideal for client consultations or focused team collaborations.
                                </p>
                                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex items-center gap-1 text-gray-400 feature-icon bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                            <VolumeX className="w-[14px] h-[14px]" /> <span className="text-[11px] font-semibold text-gray-600">Quiet</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-400 feature-icon bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                            <Users className="w-[14px] h-[14px]" /> <span className="text-[11px] font-semibold text-gray-600">6</span>
                                        </div>
                                    </div>
                                    <button className="text-[13.5px] font-bold text-blue-600 hover:text-blue-700 transition-colors">Book Now</button>
                                </div>
                            </div>
                        </div>
                    </div> {/* End Grid */}

                    {/* Recent Booking History Area */}
                    <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] w-full overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">Recent Booking History</h2>
                            </div>
                            <button className="text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
                                See all <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div className="w-full">
                            {/* Header row */}
                            <div className="grid grid-cols-12 gap-4 pb-3 border-b border-gray-100 text-[12.5px] font-bold text-gray-400 uppercase tracking-wider">
                                <div className="col-span-5 pl-2">Space Details</div>
                                <div className="col-span-3">Date & Time</div>
                                <div className="col-span-2">Amount</div>
                                <div className="col-span-2 text-right pr-2">Status</div>
                            </div>

                            {/* Empty state for now since this is just UI */}
                            <div className="py-8 text-center flex flex-col items-center justify-center">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                    <CalendarDays className="w-5 h-5 text-gray-400" />
                                </div>
                                <p className="text-[14px] font-medium text-gray-500 mb-1">No recent bookings found</p>
                                <p className="text-[13px] text-gray-400">Your upcoming and past bookings will appear here.</p>
                                <button className="mt-4 text-[13.5px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">Start exploring</button>
                            </div>
                        </div>
                    </div>
                    {/* Padding at bottom */}
                    <div className="h-10"></div>
                </div>
            </main>
        </div>
    );
};

export default RenterDashboard;
