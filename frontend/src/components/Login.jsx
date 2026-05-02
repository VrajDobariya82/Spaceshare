import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LayoutGrid, Search, Store, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('renter'); // renter, owner, admin
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            console.log("Login successful", data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success("Login successful! Welcome back.");

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
        <div className="flex min-h-screen bg-white font-sans">
            {/* Left side panel */}
            <div className="hidden lg:flex lg:w-[45%] bg-blue-600 text-white shrink-0 flex-col justify-center px-16 relative overflow-hidden">
                {/* Decorative background element, optional, but keeps it looking premium */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-700 rounded-full blur-2xl opacity-60 mix-blend-multiply"></div>

                <div className="relative z-10 w-full max-w-md mx-auto">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-sm">
                            <LayoutGrid className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[26px] font-bold tracking-tight text-white">SpaceShare</span>
                    </div>

                    <h1 className="text-4xl md:text-[44px] font-bold mb-6 leading-[1.15] tracking-tight">
                        Find your perfect<br />temporary<br />workspace today.
                    </h1>

                    <p className="text-blue-100 text-[17px] mb-16 leading-relaxed max-w-[400px]">
                        Join thousands of professionals who trust SpaceShare to find flexible, inspiring work environments tailored to their needs.
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full border-2 border-blue-600 bg-blue-200" />
                            <div className="w-10 h-10 rounded-full border-2 border-blue-600 bg-blue-100" />
                            <div className="w-10 h-10 rounded-full border-2 border-blue-600 bg-white" />
                        </div>
                        <span className="text-[14px] font-medium text-blue-50">Join 10,000+ users</span>
                    </div>
                </div>
            </div>

            {/* Right side form */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-24 py-12">
                <div className="w-full max-w-[400px] mx-auto">

                    <div className="mb-10">
                        <h2 className="text-[32px] font-bold text-gray-900 tracking-tight mb-2">Welcome back</h2>
                        <p className="text-[15px] text-gray-500">Please enter your details to sign in.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleLogin}>
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
                                <span className="text-[13px] font-semibold text-gray-900">Renter</span>
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
                                <span className="text-[13px] font-semibold text-gray-900">Owner</span>
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
                                <span className="text-[13px] font-semibold text-gray-900">Admin</span>
                            </button>
                        </div>

                        <div>
                            <label className="block text-[14px] font-medium text-gray-700 mb-1.5" htmlFor="email">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Mail className="h-[18px] w-[18px] text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    required
                                    className="block w-full rounded-xl bg-gray-50/50 border border-gray-200 py-3 pl-11 pr-4 text-[15px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[14px] font-medium text-gray-700 mb-1.5" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock className="h-[18px] w-[18px] text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="block w-full rounded-xl bg-gray-50/50 border border-gray-200 py-3 pl-11 pr-11 text-[15px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 pb-2">
                            <div className="flex items-center gap-2.5">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="w-[15px] h-[15px] rounded border-gray-300 text-blue-600 focus:ring-blue-600 bg-gray-50/50"
                                />
                                <label htmlFor="remember-me" className="text-[14px] text-gray-600 select-none cursor-pointer">
                                    Remember me
                                </label>
                            </div>
                            <a href="#" className="text-[14px] font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                                Forgot Password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full text-white font-medium py-3 px-4 rounded-xl shadow-[0_2px_10px_-3px_rgba(37,99,235,0.4)] transition-all duration-200 text-[15px] ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}
                        >
                            {isLoading ? 'Logging in...' : 'Log in'}
                        </button>

                        <p className="text-center text-[14px] text-gray-500 pt-2">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">Sign up</Link>
                        </p>
                    </form>

                    {/* Footer links */}
                    <div className="mt-16 flex items-center justify-center gap-6 text-[12px] font-medium text-gray-400">
                        <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-gray-600 transition-colors">Help Center</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
