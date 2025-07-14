import { useState } from 'react'; 

export default function CalendarPage({ user }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="h-screen flex flex-col">
            {/* Top Navbar */}
            <div className="flex items-center justify-between bg-white shadow px-4 py-2">
                {/* Left: Logo */}
                <div className="flex items-center space-x-2">
                <img src="../../public/GeminderLogo.png" alt="Geminder Logo" className="h-8 w-auto" />
                </div>

                {/* Center: Arrows */}
                <div className="flex items-center space-x-2">
                <button className="text-xl px-2">←</button>
                <button className="text-xl px-2">→</button>
                </div>

                {/* Right: Timezone, Settings, Logout */}
                <div className="flex items-center space-x-4">
                <select className="border rounded px-2 py-1 text-sm">
                    <option>Pacific Time (PT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Central Time (CT)</option>
                    <option>Eastern Time (ET)</option>
                </select>
                <button>Log Out</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar */}
                {sidebarOpen && (
                <div className="w-64 bg-gray-100 p-4 flex flex-col">
                    {/* Mini calendar placeholder */}
                    <div className="mb-4 bg-white p-2 rounded shadow">📆 Mini Calendar</div>

                    {/* Create Assistant */}
                    <button className="bg-green-500 hover:bg-green-600 text-white py-2 rounded mb-4">
                    + Create Assistant
                    </button>

                    {/* My Assistants */}
                    <div className="bg-white rounded shadow p-2 flex-1 overflow-auto">
                    <h2 className="font-semibold mb-2">My Assistants</h2>
                    {/* Sample assistant */}
                    <div className="flex justify-between items-center mb-2">
                        <span>🧠 Captain Crunch</span>
                        <button className="text-red-500 hover:text-red-700">✖</button>
                    </div>
                    </div>
                </div>
                )}

                {/* Calendar View */}
                <div className="flex-1 bg-gray-50 p-4 overflow-auto">
                {/* Placeholder for FullCalendar */}
                <div className="border border-dashed border-gray-400 h-full flex items-center justify-center">
                    FullCalendar goes here
                </div>
                </div>
            </div>
            </div>
  );
}
