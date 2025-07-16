import { useState, useEffect, useCallback } from 'react'; 
import BigCalendar from './BigCalendar.jsx';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/MiniCalendarStyles.css';
import AssistantModal from './AssistantModal.jsx';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import Notification from './Notification.jsx';


export default function CalendarPage({ user, onLogout }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState('week');
    const [showAssistantModal, setShowAssistantModal] = useState(false);
    const [assistants, setAssistants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationColor, setNotificationColor] = useState('green');


    // Fetch assistants from Firestore
    const fetchAssistants = useCallback(async () => {
        try {
            const userId = user?.uid || 'guest';
            const assistantsCollection = collection(db, 'users', userId, 'assistants');
            const assistantsSnapshot = await getDocs(assistantsCollection);
            const assistantsList = assistantsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAssistants(assistantsList);
        } catch (error) {
            console.error('Error fetching assistants:', error);
            setAssistants([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchAssistants();
    }, [fetchAssistants]);

    const handleDeleteAssistant = async (assistantId) => {
        if (window.confirm('Are you sure you want to delete this assistant?')) {
            try {
                const userId = user?.uid || 'guest';
                await deleteDoc(doc(db, 'users', userId, 'assistants', assistantId));
                setAssistants(prevAssistants => prevAssistants.filter(assistant => assistant.id !== assistantId));
                
                // Show success notification
                setNotificationMessage('Assistant deleted!');
                setNotificationColor('red');
                setShowNotification(true);
            } catch (error) {
                console.error('Error deleting assistant:', error);
                alert('Failed to delete assistant. Please try again.');
            }
        }
    };

    const handleAssistantCreated = () => {
        // Refresh the assistants list after creating a new one
        fetchAssistants();
    };

    const handleShowNotification = (message, color) => {
        setNotificationMessage(message);
        setNotificationColor(color);
        setShowNotification(true);
    };

    const handleLogout = async () => {
        try {
            if (user && user.uid) {
                // Only sign out if user is actually logged in (not guest)
                await signOut(auth);
            }
            // Call the onLogout callback to update the app state
            if (onLogout) {
                onLogout();
            }
        } catch (error) {
            console.error('Error signing out:', error);
            alert('Failed to sign out. Please try again.');
        }
    };

    return (
        <>
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

                    
                    <div className="flex items-center space-x-4">


                        {/* Log Out Button */}
                        <button 
                            onClick={handleLogout}
                            className="bg-lightGray text-white rounded px-3 py-1 hover:bg-gray-600"
                        >
                            Log Out
                        </button>
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
                        <button
                            onClick={() => setShowAssistantModal(true)}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded mb-4"
                        >
                            + Create Assistant
                        </button>

                        {/* My Assistants */}
                        <div className="bg-lightGray text-white rounded shadow p-2 flex-1 overflow-auto">
                        <h2 className="font-bold mb-2">My Assistants</h2>

                            {loading ? (
                                <p>Loading assistants...</p>
                            ) : assistants.length === 0 ? (
                                <p>No assistants found. Create one!</p>
                            ) : (
                                <ul>
                                    {assistants.map(assistant => (
                                        <li key={assistant.id} className="flex justify-between items-center mb-2">
                                            <span>{assistant.name}</span>
                                            <button 
                                                onClick={() => handleDeleteAssistant(assistant.id)}
                                                className="text-darkGray text-lg hover:text-red-500"
                                            >
                                                x
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
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
                            user={user}
                        />
                    </div>
                </div>
            </div>

            {showAssistantModal && (
                <AssistantModal 
                    onClose={() => setShowAssistantModal(false)}
                    user={user}
                    onAssistantCreated={handleAssistantCreated}
                    onShowNotification={handleShowNotification}
                />
            )}

            <Notification 
                message={notificationMessage}
                isVisible={showNotification}
                onClose={() => setShowNotification(false)}
                color={notificationColor}
            />
        </>
    );
}
