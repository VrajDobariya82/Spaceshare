import React, { useState } from 'react';
import { Search, Store, Shield, Eye, EyeOff, ArrowRight, Sofa } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Signup = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('renter'); // renter, owner, admin
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return toast.error("Passwords do not match");
        }

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Successfully registered! You would typically save the token here
            console.log("Registration successful", data);
            localStorage.setItem('token', data.token);
            toast.success("Registration successful! You can now access the dashboard.");

            // Redirect based on role
            if (role === 'renter') {
                navigate('/renter-dashboard');
            } else if (role === 'owner') {
                navigate('/owner-dashboard');
            } else if (role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/');
            }

        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Left side banner */}
            <div className="hidden lg:flex lg:w-[45%] relative rounded-r-3xl overflow-hidden shrink-0">
                <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Creative office space"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>

                {/* Content */}
                <div className="absolute bottom-16 left-12 right-12 text-white">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20 shadow-lg">
                        <Sofa className="w-7 h-7 text-white" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
                        Find your perfect<br />creative space.
                    </h1>

                    <p className="text-gray-200 text-lg mb-10 max-w-sm leading-relaxed">
                        Whether you need a studio for a day or an office for a month, SpaceShare connects you with unique local spaces.
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            <img src="https://i.pravatar.cc/100?img=33" alt="User" className="w-10 h-10 rounded-full border-2 border-gray-800 object-cover" />
                            <img src="https://i.pravatar.cc/100?img=47" alt="User" className="w-10 h-10 rounded-full border-2 border-gray-800 object-cover" />
                            <div className="w-10 h-10 rounded-full border-2 border-gray-800 bg-white text-gray-900 flex items-center justify-center text-xs font-bold shadow-sm z-10 relative">
                                +2k
                            </div>
                        </div>
                        <span className="text-sm font-medium text-gray-200">creators joined last week</span>
                    </div>
                </div>
            </div>

            {/* Right side form */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-24 py-12 overflow-y-auto">
                <div className="w-full max-w-md mx-auto">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-2.5 mb-10">
                        <div className="w-9 h-9 bg-blue-600 rounded-[10px] flex items-center justify-center shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                            </svg>
                        </div>
                        <span className="text-[22px] font-bold tracking-tight text-gray-900">SpaceShare</span>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create your account</h2>
                        <p className="mt-2 text-[15px] text-gray-500 tracking-wide">Select your role to get started.</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{error}</div>}
                        {/* Roles Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            {/* Renter Card */}
                            <button
                                type="button"
                                onClick={() => setRole('renter')}
                                className={`relative flex flex-col items-center justify-center py-4 px-2 rounded-xl border transition-all duration-200 ${role === 'renter'
                                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${role === 'renter' ? 'bg-blue-100 text-blue-600' : 'bg-blue-50 text-blue-500'}`}>
                                    <Search className="w-4 h-4" strokeWidth={2.5} />
                                </div>
                                <span className="text-[13px] font-semibold text-gray-900">Rent a Space</span>
                                <span className="text-[10px] text-gray-400 font-medium tracking-wide mt-0.5">Find & Book</span>
                            </button>

                            {/* Owner Card */}
                            <button
                                type="button"
                                onClick={() => setRole('owner')}
                                className={`relative flex flex-col items-center justify-center py-4 px-2 rounded-xl border transition-all duration-200 ${role === 'owner'
                                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${role === 'owner' ? 'bg-purple-100 text-purple-600' : 'bg-purple-50 text-purple-500'}`}>
                                    <Store className="w-4 h-4" strokeWidth={2.5} />
                                </div>
                                <span className="text-[13px] font-semibold text-gray-900">List My Space</span>
                                <span className="text-[10px] text-gray-400 font-medium tracking-wide mt-0.5">Earn income</span>
                            </button>

                            {/* Admin Card */}
                            <button
                                type="button"
                                onClick={() => setRole('admin')}
                                className={`relative flex flex-col items-center justify-center py-4 px-2 rounded-xl border transition-all duration-200 ${role === 'admin'
                                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${role === 'admin' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                    <Shield className="w-4 h-4" strokeWidth={2.5} />
                                </div>
                                <span className="text-[13px] font-semibold text-gray-900">Admin Login</span>
                                <span className="text-[10px] text-gray-400 font-medium tracking-wide mt-0.5">Manage Platform</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="name">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Jane Doe"
                                    required
                                    className="block w-full rounded-lg border-gray-200 border px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                    className="block w-full rounded-lg border-gray-200 border px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="password">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="block w-full rounded-lg border-gray-200 border pl-4 pr-10 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1.5" htmlFor="confirm-password">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirm-password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="block w-full rounded-lg border-gray-200 border pl-4 pr-10 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                id="terms"
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            />
                            <label htmlFor="terms" className="text-[13.5px] text-gray-600">
                                I agree to the <a href="#" className="font-medium text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="font-medium text-blue-600 hover:underline">Privacy Policy</a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full text-white font-medium py-3 px-4 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 group ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}
                        >
                            {isLoading ? 'Creating account...' : 'Sign Up'}
                            {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
                        </button>

                        <p className="text-center text-[14px] text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-blue-600 hover:underline">Log in</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
