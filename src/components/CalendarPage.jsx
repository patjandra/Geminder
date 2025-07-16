import { useState } from 'react'; 
import BigCalendar from './BigCalendar.jsx';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Required styles
import { useRef } from 'react';
import 'react-calendar/dist/Calendar.css';
import '../styles/MiniCalendarStyles.css';


export default function CalendarPage({ user }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState('week');

    return (
        <div className="h-screen flex flex-col">
            {/* Top Navbar */}
            <div className="flex items-center justify-between bg-darkGray shadow px-4 py-2">
                    {/* Hamburger, Logo Group */}
                    <div className="flex items-center space-x-7">
                        {/* Hamburger Menu */}
                        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <img src="/HamburgerIcon.png" alt="Hamburger Icon" className="h-8 w-auto"></img>
                        </button>

                        {/* Logo */}
                        <img src="../../public/GeminderLogo.png" alt="Geminder Logo" className="h-8 w-auto" />
                    </div>

                {/* Right: Timezone, Logout Group */}
                <div className="flex items-center space-x-4">
                    {/* Timezone Dropdown*/}
                    <select className="border rounded px-2 py-1 text-sm">
                        <option>Pacific Time (PT)</option>
                        <option>Mountain Time (MT)</option>
                        <option>Central Time (CT)</option>
                        <option>Eastern Time (ET)</option>
                    </select>

                    {/* Log Out Button */}
                    <button className="bg-lightGray text-white rounded px-3 py-1">Log Out</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar */}
                {sidebarOpen && (
                <div className="w-64 bg-darkGray p-4 flex flex-col">
                    {/* Mini calendar placeholder */}
                    <div className="mb-4 rounded shadow">
                        <Calendar 
                            onChange={setCurrentDate}
                            value={currentDate}
                            locale="en-US"
                            className="text-sm rounded-2xl"
                        />
                    </div>

                    {/* Create Assistant */}
                    <button className="bg-green-500 hover:bg-green-500 text-white py-2 rounded mb-4">
                    + Create Assistant
                    </button>

                    {/* My Assistants */}
                    <div className="bg-lightGray text-white rounded shadow p-2 flex-1 overflow-auto">
                    <h2 className="font-semibold mb-2">My Assistants</h2>

                        {/* Sample assistant */}
                        <div className="flex justify-between items-center mb-2">
                            <span>🏴‍☠️ Captain Crunch</span>
                            <button className="text-darkGray text-lg hover:text-red-500">x</button>
                        </div>
                    </div>
                </div>
                )}

                {/* Placeholder for FullCalendar */}
                <div className="w-full h-full">
                    < BigCalendar 
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        currentView={currentView}
                        setCurrentView={setCurrentView} 
                    />
                </div>
            </div>
            </div>
  );
}
