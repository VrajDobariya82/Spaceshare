import React, { useEffect, useState } from 'react';
import {
    Home,
    LayoutDashboard,
    Building2,
    PlusSquare,
    LogOut,
    Plus,
    MapPin,
    DollarSign,
    FileText,
    X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const API = 'http://localhost:5000/api';

const OwnerDashboard = () => {
    const navigate = useNavigate();
    const [spaces, setSpaces] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form state
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchMySpaces();
    }, []);

    const fetchMySpaces = async () => {
        try {
            const res = await fetch(`${API}/spaces/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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

    const handleAddSpace = async (e) => {
        e.preventDefault();
        if (!title || !location || !price) {
            toast.error('Please fill title, location and price');
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch(`${API}/spaces`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title, location, price: Number(price), description })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success('Space added successfully!');
            setSpaces([data, ...spaces]);
            setTitle('');
            setLocation('');
            setPrice('');
            setDescription('');
            setShowForm(false);
        } catch (err) {
            toast.error(err.message || 'Failed to add space');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col justify-between shrink-0 h-full">
                <div>
                    {/* Logo */}
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
                        <button
                            onClick={() => setShowForm(false)}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-[14px] transition-colors w-full ${!showForm ? 'bg-blue-50/70 text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <LayoutDashboard className="w-[18px] h-[18px]" />
                            My Spaces
                        </button>
                        <button
                            onClick={() => setShowForm(true)}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-[14px] transition-colors w-full ${showForm ? 'bg-blue-50/70 text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <PlusSquare className="w-[18px] h-[18px]" />
                            Add New Space
                        </button>
                    </nav>
                </div>

                {/* Logout */}
                <div className="p-4 border-t border-gray-100">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium text-[14px] transition-colors w-full">
                        <LogOut className="w-[18px] h-[18px]" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-8 py-6">
                <div className="max-w-[900px] mx-auto">

                    {showForm ? (
                        /* ==================== ADD SPACE FORM ==================== */
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Add New Space</h1>
                                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleAddSpace} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Title</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Building2 className="h-[18px] w-[18px] text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g. Downtown Co-working Space"
                                            className="block w-full rounded-xl bg-gray-50/50 border border-gray-200 py-3 pl-11 pr-4 text-[15px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Location</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <MapPin className="h-[18px] w-[18px] text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="e.g. New York, NY"
                                            className="block w-full rounded-xl bg-gray-50/50 border border-gray-200 py-3 pl-11 pr-4 text-[15px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Price ($/hour)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <DollarSign className="h-[18px] w-[18px] text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="e.g. 50"
                                            min="1"
                                            className="block w-full rounded-xl bg-gray-50/50 border border-gray-200 py-3 pl-11 pr-4 text-[15px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-[14px] font-medium text-gray-700 mb-1.5">Description (optional)</label>
                                    <div className="relative">
                                        <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none">
                                            <FileText className="h-[18px] w-[18px] text-gray-400" />
                                        </div>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Describe your space..."
                                            rows={3}
                                            className="block w-full rounded-xl bg-gray-50/50 border border-gray-200 py-3 pl-11 pr-4 text-[15px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full flex items-center justify-center gap-2 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition-all duration-200 text-[15px] ${submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                >
                                    <Plus className="w-4 h-4" />
                                    {submitting ? 'Adding...' : 'Add Space'}
                                </button>
                            </form>
                        </div>
                    ) : (
                        /* ==================== MY SPACES LIST ==================== */
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">My Spaces</h1>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[14px] font-medium shadow-sm transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> Add New Space
                                </button>
                            </div>

                            {loading ? (
                                <div className="text-center py-20 text-gray-400 text-[15px]">Loading...</div>
                            ) : spaces.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Building2 className="w-7 h-7 text-gray-300" />
                                    </div>
                                    <p className="text-[16px] font-medium text-gray-500 mb-2">No spaces listed yet</p>
                                    <p className="text-[14px] text-gray-400 mb-6">Add your first space to start receiving bookings.</p>
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-[14px] font-medium transition-colors"
                                    >
                                        <Plus className="w-4 h-4" /> Add Space
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {spaces.map((space) => (
                                        <div key={space._id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-[18px] font-bold text-gray-900 mb-1">{space.title}</h3>
                                                    <div className="flex items-center gap-4 text-[14px] text-gray-500">
                                                        <span className="flex items-center gap-1.5">
                                                            <MapPin className="w-4 h-4 text-gray-400" />
                                                            {space.location}
                                                        </span>
                                                        <span className="flex items-center gap-1.5">
                                                            <DollarSign className="w-4 h-4 text-gray-400" />
                                                            ${space.price}/hr
                                                        </span>
                                                    </div>
                                                    {space.description && (
                                                        <p className="text-[13px] text-gray-400 mt-2 line-clamp-2">{space.description}</p>
                                                    )}
                                                </div>
                                                <span className="bg-emerald-100/60 text-emerald-600 border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default OwnerDashboard;
