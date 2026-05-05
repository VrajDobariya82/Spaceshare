import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, DollarSign } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const API = 'http://localhost:5000/api';

const SearchAutocomplete = ({ onSelect }) => {
    const { darkMode } = useTheme();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const containerRef = useRef(null);
    const debounceRef = useRef(null);

    const typeLabel = { room: '🏠', office: '🏢', storage: '📦', event: '🎉' };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (value) => {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (value.length < 2) {
            setResults([]);
            setShowResults(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`${API}/search/autocomplete?q=${encodeURIComponent(value)}`);
                const data = await res.json();
                setResults(data);
                setShowResults(true);
            } catch (err) { console.error(err); }
        }, 300);
    };

    const handleSelect = (space) => {
        setQuery(space.title);
        setShowResults(false);
        if (onSelect) onSelect(space);
    };

    return (
        <div className="relative" ref={containerRef}>
            <div className="relative">
                <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => results.length > 0 && setShowResults(true)}
                    placeholder="Search spaces, locations..."
                    className={`w-full rounded-xl py-2.5 pl-10 pr-4 text-[14px] outline-none transition-all border ${
                        darkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                            : 'bg-gray-50/50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                    }`}
                />
            </div>

            {showResults && results.length > 0 && (
                <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl border z-50 overflow-hidden ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                    {results.map(space => (
                        <button
                            key={space._id}
                            onClick={() => handleSelect(space)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b last:border-b-0 ${
                                darkMode
                                    ? 'border-gray-700 hover:bg-gray-700'
                                    : 'border-gray-50 hover:bg-gray-50'
                            }`}
                        >
                            <span className="text-[16px]">{typeLabel[space.type] || '🏠'}</span>
                            <div className="flex-1 min-w-0">
                                <p className={`text-[13px] font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{space.title}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`flex items-center gap-1 text-[11px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        <MapPin className="w-3 h-3" />{space.location}
                                    </span>
                                    <span className={`text-[11px] font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        ${space.price}/hr
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchAutocomplete;
