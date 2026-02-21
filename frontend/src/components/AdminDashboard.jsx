import React, { useEffect, useState } from 'react';
import {
    Home,
    LayoutDashboard,
    Users,
    Building,
    CheckSquare,
    CalendarDays,
    CreditCard,
    BarChart3,
    Settings,
    LogOut,
    Search,
    Bell,
    ChevronDown,
    Filter,
    Download,
    MoreVertical,
    TrendingUp,
    AlertTriangle,
    Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: 'Alex Admin', role: 'Super Admin' });

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
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                            <Home className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="text-[18px] font-bold text-gray-900 leading-none block tracking-tight">SpaceShare</span>
                            <span className="text-[10px] font-bold text-gray-400 tracking-wider mt-0.5 block">Admin Portal</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="px-4 space-y-1">
                        <div className="pt-2 pb-2">
                            <div className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Management</div>
                        </div>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 bg-blue-50/70 text-blue-600 rounded-xl font-semibold text-[14px] transition-colors">
                            <LayoutDashboard className="w-[18px] h-[18px]" />
                            Dashboard
                        </a>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14px] transition-colors">
                            <Users className="w-[18px] h-[18px]" />
                            Manage Users
                        </a>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14px] transition-colors">
                            <Building className="w-[18px] h-[18px]" />
                            Space Listings
                        </a>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14px] transition-colors relative">
                            <CheckSquare className="w-[18px] h-[18px]" />
                            Approve Listings
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-100 text-red-600 flex items-center justify-center rounded-md text-[10px] font-bold">24</span>
                        </a>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14px] transition-colors">
                            <CalendarDays className="w-[18px] h-[18px]" />
                            Bookings
                        </a>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14px] transition-colors">
                            <CreditCard className="w-[18px] h-[18px]" />
                            Payments
                        </a>
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14px] transition-colors">
                            <BarChart3 className="w-[18px] h-[18px]" />
                            Analytics
                        </a>
                    </nav>
                </div>

                {/* Bottom Settings & Logout */}
                <div>
                    <nav className="px-4 pb-2 space-y-1 border-t border-gray-100 pt-4 mt-2">
                        <a href="#" className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14px] transition-colors">
                            <Settings className="w-[18px] h-[18px]" />
                            Settings
                        </a>
                        <button onClick={handleLogout} className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium text-[14px] transition-colors w-full">
                            <LogOut className="w-[18px] h-[18px]" />
                            Log Out
                        </button>
                    </nav>

                    {/* User Profile Section Bottom */}
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition-colors group cursor-pointer">
                            <img src="https://i.pravatar.cc/150?img=11" alt="User Avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                            <div className="overflow-hidden">
                                <h4 className="text-[13px] font-bold text-gray-900 truncate">{user.name}</h4>
                                <p className="text-[11px] text-gray-500 truncate">{user.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto w-full">

                {/* Top Navbar */}
                <header className="bg-white border-b border-gray-100 h-20 px-8 flex items-center justify-between sticky top-0 z-10 w-full">
                    <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">Platform Overview</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search users, listings..."
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] text-gray-900 placeholder:text-gray-500 outline-none w-[320px] focus:bg-white focus:border-blue-500 transition-all"
                            />
                        </div>
                        <button className="w-9 h-9 flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-600 rounded-lg relative hover:bg-gray-100 transition-colors">
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                <div className="p-8 max-w-[1400px] mx-auto">

                    {/* Greeting Row */}
                    <div className="mb-6">
                        <p className="text-[14px] text-gray-500 font-medium">Here is your daily platform summary.</p>
                    </div>

                    {/* Stats Cards Row */}
                    <div className="flex overflow-x-auto gap-5 mb-8 pb-2 scrollbar-none w-full">
                        {/* Users */}
                        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 shrink-0 w-[280px]">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-[13px] font-bold text-gray-500">Total Users</div>
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <Users className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="text-[32px] font-bold text-gray-900 leading-none mb-3">14,205</div>
                            <div className="flex items-center gap-2 text-[12px] font-medium">
                                <span className="text-emerald-600 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> 12%</span>
                                <span className="text-gray-400">new this month</span>
                            </div>
                        </div>

                        {/* Active Listings */}
                        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 shrink-0 w-[280px]">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-[13px] font-bold text-gray-500">Active Listings</div>
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <Building className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="text-[32px] font-bold text-gray-900 leading-none mb-3">2,845</div>
                            <div className="flex items-center gap-2 text-[12px] font-medium">
                                <span className="text-emerald-600 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> 5.4%</span>
                                <span className="text-gray-400">new this week</span>
                            </div>
                        </div>

                        {/* Listing Requests */}
                        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-amber-200/50 shrink-0 w-[280px] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="text-[13px] font-bold text-gray-500">Listing Requests</div>
                                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                                    <CheckSquare className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="text-[32px] font-bold text-gray-900 leading-none mb-3 relative z-10">24</div>
                            <div className="flex items-center gap-2 text-[12px] font-semibold text-amber-600 relative z-10">
                                <AlertTriangle className="w-3.5 h-3.5" /> Action Required
                            </div>
                        </div>

                        {/* Total Bookings */}
                        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 shrink-0 w-[280px]">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-[13px] font-bold text-gray-500">Total Bookings</div>
                                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                                    <CalendarDays className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="text-[32px] font-bold text-gray-900 leading-none mb-3">842</div>
                            <div className="flex items-center gap-2 text-[12px] font-medium">
                                <span className="text-emerald-600 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> 4%</span>
                                <span className="text-gray-400">vs last week</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Middle Left: Analytics Chart Placeholder */}
                        <div className="lg:col-span-2 bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col h-[400px]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-[16px] font-bold text-gray-900">Platform Analytics</h3>
                                <button className="flex items-center gap-2 text-[12px] font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                                    Last 7 Days <ChevronDown className="w-3 h-3" />
                                </button>
                            </div>

                            {/* Empty state / placeholder for chart */}
                            <div className="flex-1 w-full bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center relative">
                                <p className="text-[13px] font-medium text-gray-400">Chart Visualization Area</p>

                                <div className="absolute bottom-4 left-0 w-full flex justify-between px-8 text-[11px] text-gray-400 font-medium">
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

                        {/* Middle Right: Recent Users */}
                        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col h-[400px]">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-[16px] font-bold text-gray-900">Recent Users</h3>
                                <a href="#" className="text-[12px] font-bold text-blue-600 hover:text-blue-700 transition-colors">View All</a>
                            </div>

                            <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-none">
                                {/* User 1 */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[13px] font-bold shrink-0">
                                            JD
                                        </div>
                                        <div>
                                            <h4 className="text-[13.5px] font-bold text-gray-900 leading-tight">John Doe</h4>
                                            <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">john@example.com</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md text-[10px] font-bold">Active</span>
                                </div>

                                {/* User 2 */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-[13px] font-bold shrink-0">
                                            AS
                                        </div>
                                        <div>
                                            <h4 className="text-[13.5px] font-bold text-gray-900 leading-tight">Alice Smith</h4>
                                            <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">alice.s@studio.com</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md text-[10px] font-bold">Active</span>
                                </div>

                                {/* User 3 */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-[13px] font-bold shrink-0">
                                            RJ
                                        </div>
                                        <div>
                                            <h4 className="text-[13.5px] font-bold text-gray-900 leading-tight">Robert Johnson</h4>
                                            <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">rob.j@techflow.io</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-md text-[10px] font-bold">Pending</span>
                                </div>

                                {/* User 4 */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center text-[13px] font-bold shrink-0">
                                            EM
                                        </div>
                                        <div>
                                            <h4 className="text-[13.5px] font-bold text-gray-900 leading-tight">Emma Martinez</h4>
                                            <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">emma@creative.co</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md text-[10px] font-bold">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pending Listing Requests Table */}
                    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden mb-10 w-full">
                        <div className="p-6 flex items-center justify-between border-b border-gray-100">
                            <h3 className="text-[18px] font-bold text-gray-900">Pending Listing Requests</h3>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                    Filter <Filter className="w-3.5 h-3.5" />
                                </button>
                                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                    Export <Download className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        <div className="w-full">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 py-3 px-6 bg-gray-50/50 text-[12px] font-bold text-gray-500 border-b border-gray-100">
                                <div className="col-span-3">Space Title</div>
                                <div className="col-span-2">Owner</div>
                                <div className="col-span-2">Location</div>
                                <div className="col-span-1 text-center">Price/Hr</div>
                                <div className="col-span-2 text-center">Submitted</div>
                                <div className="col-span-2 text-right">Actions</div>
                            </div>

                            {/* Row 1 */}
                            <div className="grid grid-cols-12 gap-4 py-5 px-6 items-center hover:bg-gray-50/30 border-b border-gray-50 transition-colors">
                                <div className="col-span-3">
                                    <div className="text-[13.5px] font-bold text-gray-900 leading-tight">Industrial Photo Studio</div>
                                    <div className="text-[11px] text-gray-500 font-medium">Studio Space</div>
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px] font-bold shrink-0">SJ</div>
                                    <div className="text-[13px] font-medium text-gray-700">Sarah Jenkins</div>
                                </div>
                                <div className="col-span-2 text-[13px] font-medium text-gray-600">
                                    Brooklyn, NY
                                </div>
                                <div className="col-span-1 text-center text-[13px] font-bold text-gray-900">
                                    $150
                                </div>
                                <div className="col-span-2 flex items-center justify-center gap-1.5">
                                    <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 w-fit">
                                        <Clock className="w-3 h-3" /> 2 hrs ago
                                    </span>
                                </div>
                                <div className="col-span-2 flex justify-end gap-2">
                                    <button className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-[12px] font-bold hover:bg-gray-50 transition-colors">Reject</button>
                                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[12px] font-bold hover:bg-blue-700 transition-colors">Approve</button>
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-12 gap-4 py-5 px-6 items-center hover:bg-gray-50/30 transition-colors">
                                <div className="col-span-3">
                                    <div className="text-[13.5px] font-bold text-gray-900 leading-tight">Downtown Boardroom</div>
                                    <div className="text-[11px] text-gray-500 font-medium">Meeting Room</div>
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[9px] font-bold shrink-0">TF</div>
                                    <div className="text-[13px] font-medium text-gray-700">TechFlow Inc.</div>
                                </div>
                                <div className="col-span-2 text-[13px] font-medium text-gray-600">
                                    Austin, TX
                                </div>
                                <div className="col-span-1 text-center text-[13px] font-bold text-gray-900">
                                    $75
                                </div>
                                <div className="col-span-2 flex items-center justify-center gap-1.5">
                                    <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 w-fit">
                                        <Clock className="w-3 h-3" /> 5 hrs ago
                                    </span>
                                </div>
                                <div className="col-span-2 flex justify-end gap-2">
                                    <button className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-[12px] font-bold hover:bg-gray-50 transition-colors">Reject</button>
                                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[12px] font-bold hover:bg-blue-700 transition-colors">Approve</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
