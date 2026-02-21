import React, { useEffect, useState } from 'react';
import {
    Home,
    LayoutDashboard,
    Building2,
    PlusSquare,
    CalendarCheck,
    DollarSign,
    MessageSquare,
    Star,
    User,
    Settings,
    LogOut,
    Search,
    Bell,
    Plus,
    Store,
    Calendar,
    TrendingUp,
    ChevronDown,
    Check,
    X,
    MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: 'Alex Johnson', email: 'alex@spaceshare.com' });

    useEffect(() => {
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
            <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col justify-between shrink-0 h-full">
                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
                    {/* Logo Section */}
                    <div className="px-6 py-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                            <Home className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[18px] font-bold text-gray-900 leading-none block tracking-tight">SpaceShare</span>
                            <span className="text-[10px] font-bold text-gray-400 tracking-wider mt-0.5 block">Owner Portal</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="px-4 space-y-1">
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 bg-blue-50/70 text-blue-600 rounded-xl font-semibold text-[14px] transition-colors">
                            <LayoutDashboard className="w-[18px] h-[18px]" />
                            Dashboard
                        </a>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14px] transition-colors">
                            <Building2 className="w-[18px] h-[18px]" />
                            My Spaces
                        </a>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14px] transition-colors">
                            <PlusSquare className="w-[18px] h-[18px]" />
                            Add New Space
                        </a>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14px] transition-colors">
                            <CalendarCheck className="w-[18px] h-[18px]" />
                            Booking Requests
                        </a>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14px] transition-colors">
                            <DollarSign className="w-[18px] h-[18px]" />
                            Earnings Overview
                        </a>
                        <div className="pt-4 pb-2">
                            <div className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account</div>
                        </div>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14px] transition-colors relative">
                            <MessageSquare className="w-[18px] h-[18px]" />
                            Messages
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></span>
                        </a>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14px] transition-colors">
                            <Star className="w-[18px] h-[18px]" />
                            Reviews
                        </a>
                        <div className="pt-4 pb-2">
                            <div className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Settings</div>
                        </div>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14px] transition-colors">
                            <User className="w-[18px] h-[18px]" />
                            Profile
                        </a>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14px] transition-colors">
                            <Settings className="w-[18px] h-[18px]" />
                            Settings
                        </a>
                    </nav>
                </div>

                {/* User Profile Section Bottom */}
                <div className="p-4 border-t border-gray-100">
                    <div onClick={handleLogout} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors group">
                        <img src="https://i.pravatar.cc/150?img=11" alt="User Avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                        <div className="overflow-hidden">
                            <h4 className="text-[13px] font-bold text-gray-900 truncate">{user.name}</h4>
                            <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                        </div>
                        <LogOut className="w-4 h-4 text-gray-400 ml-auto group-hover:text-gray-600 transition-colors shrink-0" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-8 py-6">
                <div className="max-w-[1300px] mx-auto">

                    {/* Top Top Navbar Area */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">Dashboard Overview</h2>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search spaces, bookings..."
                                    className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-[13px] text-gray-900 placeholder:text-gray-500 outline-none w-[280px]"
                                />
                            </div>
                            <button className="w-9 h-9 flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg relative">
                                <Bell className="w-4 h-4" />
                                <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                            </button>
                        </div>
                    </div>

                    {/* Greeting Row */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight flex items-center gap-2 mb-1">
                                Welcome back, {user.name.split(' ')[0]} <span className="text-2xl">👋</span>
                            </h1>
                            <p className="text-[14px] text-gray-500 font-medium">Here's what's happening with your spaces today.</p>
                        </div>
                        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[14px] font-medium shadow-sm transition-colors">
                            <Plus className="w-4 h-4" /> Add New Space
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                        {/* Total Spaces */}
                        <div className="bg-white p-6 rounded-[20px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100/60">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-[13px] font-bold text-gray-400 uppercase tracking-wide">Total Spaces</div>
                                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <Store className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="text-[36px] font-bold text-gray-900 leading-none mb-3">12</div>
                            <div className="flex items-center gap-2 text-[12px] font-medium">
                                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">+ 2 New</span>
                                <span className="text-gray-400">this month</span>
                            </div>
                        </div>

                        {/* Total Bookings */}
                        <div className="bg-white p-6 rounded-[20px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100/60">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-[13px] font-bold text-gray-400 uppercase tracking-wide">Total Bookings</div>
                                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                                    <Calendar className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="text-[36px] font-bold text-gray-900 leading-none mb-3">148</div>
                            <div className="flex items-center gap-2 text-[12px] font-medium">
                                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +8.2%</span>
                                <span className="text-gray-400">vs last month</span>
                            </div>
                        </div>

                        {/* Earnings */}
                        <div className="bg-white p-6 rounded-[20px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100/60">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-[13px] font-bold text-gray-400 uppercase tracking-wide">Earnings</div>
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <DollarSign className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="text-[36px] font-bold text-gray-900 leading-none mb-3">$12,450</div>
                            <div className="flex items-center gap-2 text-[12px] font-medium">
                                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12%</span>
                                <span className="text-gray-400">vs last month</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Middle Left: Earnings Analytics */}
                        <div className="lg:col-span-2 bg-white rounded-[20px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100/60 flex flex-col h-[380px]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-[16px] font-bold text-gray-900">Earnings Analytics</h3>
                                <button className="flex items-center gap-2 text-[12px] font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                                    Last 30 Days <ChevronDown className="w-3 h-3" />
                                </button>
                            </div>

                            {/* Mockup SVG Chart */}
                            <div className="flex-1 relative w-full h-full">
                                <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 800 200">
                                    {/* Grid Lines */}
                                    <line x1="0" y1="40" x2="800" y2="40" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                                    <line x1="0" y1="100" x2="800" y2="100" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                                    <line x1="0" y1="160" x2="800" y2="160" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />

                                    {/* Line Graph */}
                                    <defs>
                                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                                            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>

                                    <path
                                        d="M0,160 L120,140 L240,165 L360,100 L480,120 L600,80 L720,130 L800,125"
                                        fill="none"
                                        stroke="#2563EB"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                    <path
                                        d="M0,160 L120,140 L240,165 L360,100 L480,120 L600,80 L720,130 L800,125 L800,200 L0,200 Z"
                                        fill="url(#gradient)"
                                    />

                                    {/* Dots */}
                                    <circle cx="120" cy="140" r="4" fill="white" stroke="#2563EB" strokeWidth="3" />
                                    <circle cx="240" cy="165" r="4" fill="white" stroke="#2563EB" strokeWidth="3" />
                                    <circle cx="360" cy="100" r="4" fill="white" stroke="#2563EB" strokeWidth="3" />
                                    <circle cx="480" cy="120" r="4" fill="white" stroke="#2563EB" strokeWidth="3" />
                                    <circle cx="600" cy="80" r="4" fill="white" stroke="#2563EB" strokeWidth="3" />
                                    <circle cx="720" cy="130" r="4" fill="white" stroke="#2563EB" strokeWidth="3" />
                                </svg>

                                {/* X Axis Labels */}
                                <div className="absolute bottom-[-5px] left-0 w-full flex justify-between text-[11px] text-gray-400 font-medium px-4">
                                    <span>Mon</span>
                                    <span>Tue</span>
                                    <span>Wed</span>
                                    <span>Thu</span>
                                    <span>Fri</span>
                                    <span>Sat</span>
                                    <span>Sun</span>
                                </div>
                            </div>
                        </div>

                        {/* Middle Right: Booking Requests */}
                        <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100/60 flex flex-col h-[380px]">
                            <h3 className="text-[16px] font-bold text-gray-900 mb-5">Booking Requests</h3>

                            <div className="space-y-3 flex-1 overflow-y-auto pr-2 scrollbar-none">
                                {/* Match 1 */}
                                <div className="bg-gray-50/50 hover:bg-gray-50 p-3 rounded-2xl flex items-center justify-between border border-transparent hover:border-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                                            <User className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-[13px] font-bold text-gray-900 leading-tight">James Smith</h4>
                                            <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">Requested<br />"Downtown Loft"</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                                            <Check className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Match 2 */}
                                <div className="bg-gray-50/50 hover:bg-gray-50 p-3 rounded-2xl flex items-center justify-between border border-transparent hover:border-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <img src="https://i.pravatar.cc/100?img=5" alt="User" className="w-10 h-10 rounded-full shrink-0" />
                                        <div>
                                            <h4 className="text-[13px] font-bold text-gray-900 leading-tight">Sarah Connor</h4>
                                            <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">Requested<br />"Creative Studio"</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                                            <Check className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Match 3 */}
                                <div className="bg-gray-50/50 hover:bg-gray-50 p-3 rounded-2xl flex items-center justify-between border border-transparent hover:border-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center shrink-0">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-[13px] font-bold text-gray-900 leading-tight">Michael B.</h4>
                                            <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">Requested<br />"Garden Office"</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                                            <Check className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-4 py-2 border border-gray-200 rounded-xl text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                View all requests
                            </button>
                        </div>
                    </div>

                    {/* Bottom Table: My Listed Spaces */}
                    <div className="bg-white rounded-[20px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100/60 overflow-hidden mb-10">
                        <div className="p-6 flex items-center justify-between border-b border-gray-100">
                            <h3 className="text-[18px] font-bold text-gray-900">My Listed Spaces</h3>
                            <a href="#" className="flex items-center gap-1 text-[13px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                View All
                            </a>
                        </div>

                        <div className="w-full">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 py-3 px-6 bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                <div className="col-span-5">Space Details</div>
                                <div className="col-span-2 text-center">Status</div>
                                <div className="col-span-2 text-center">Price / Hour</div>
                                <div className="col-span-2 text-center">Total Revenue</div>
                                <div className="col-span-1 text-right">Actions</div>
                            </div>

                            {/* Row 1 */}
                            <div className="grid grid-cols-12 gap-4 py-4 px-6 items-center hover:bg-gray-50/30 border-b border-gray-50 transition-colors">
                                <div className="col-span-5 flex items-center gap-4">
                                    <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=70&fit=crop" className="w-[80px] h-[55px] rounded-lg object-cover" alt="Space" />
                                    <div>
                                        <p className="text-[14px] font-bold text-gray-900 mb-0.5">Downtown Industrial Loft</p>
                                        <p className="text-[11px] font-medium text-gray-500">New York, NY</p>
                                    </div>
                                </div>
                                <div className="col-span-2 text-center flex justify-center">
                                    <span className="bg-emerald-100/60 text-emerald-600 border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                                    </span>
                                </div>
                                <div className="col-span-2 text-center text-[14px] font-medium text-gray-700">
                                    $85.00
                                </div>
                                <div className="col-span-2 text-center text-[14px] font-semibold text-gray-900">
                                    $4,250.00
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <button className="text-gray-400 hover:text-gray-900 transition-colors p-1">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-12 gap-4 py-4 px-6 items-center hover:bg-gray-50/30 border-b border-gray-50 transition-colors">
                                <div className="col-span-5 flex items-center gap-4">
                                    <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=100&h=70&fit=crop" className="w-[80px] h-[55px] rounded-lg object-cover" alt="Space" />
                                    <div>
                                        <p className="text-[14px] font-bold text-gray-900 mb-0.5">Sunny Creative Studio</p>
                                        <p className="text-[11px] font-medium text-gray-500">Brooklyn, NY</p>
                                    </div>
                                </div>
                                <div className="col-span-2 text-center flex justify-center">
                                    <span className="bg-emerald-100/60 text-emerald-600 border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                                    </span>
                                </div>
                                <div className="col-span-2 text-center text-[14px] font-medium text-gray-700">
                                    $60.00
                                </div>
                                <div className="col-span-2 text-center text-[14px] font-semibold text-gray-900">
                                    $1,840.00
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <button className="text-gray-400 hover:text-gray-900 transition-colors p-1">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div className="grid grid-cols-12 gap-4 py-4 px-6 items-center hover:bg-gray-50/30 transition-colors">
                                <div className="col-span-5 flex items-center gap-4">
                                    <img src="https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=100&h=70&fit=crop" className="w-[80px] h-[55px] rounded-lg object-cover" alt="Space" />
                                    <div>
                                        <p className="text-[14px] font-bold text-gray-900 mb-0.5">Minimalist Meeting Pod</p>
                                        <p className="text-[11px] font-medium text-gray-500">San Francisco, CA</p>
                                    </div>
                                </div>
                                <div className="col-span-2 text-center flex justify-center">
                                    <span className="bg-gray-100 text-gray-600 border border-gray-200 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Inactive
                                    </span>
                                </div>
                                <div className="col-span-2 text-center text-[14px] font-medium text-gray-700">
                                    $45.00
                                </div>
                                <div className="col-span-2 text-center text-[14px] font-semibold text-gray-900">
                                    $850.00
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <button className="text-gray-400 hover:text-gray-900 transition-colors p-1">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default OwnerDashboard;
