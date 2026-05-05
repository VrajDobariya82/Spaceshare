import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DarkModeToggle = () => {
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <button
            onClick={toggleDarkMode}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 flex items-center px-1 ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <div className={`w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300 ${darkMode ? 'translate-x-7' : 'translate-x-0'}`}>
                {darkMode ? <Moon className="w-3 h-3 text-indigo-600" /> : <Sun className="w-3 h-3 text-amber-500" />}
            </div>
        </button>
    );
};

export default DarkModeToggle;
