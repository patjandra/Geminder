import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/BigCalendarStyles.css';
import EventModal from './EventModal.jsx';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Custom Event Component
const EventComponent = ({ event }) => {
  const hasLocation = event.location && event.location.trim() !== '';
  
  return (
    <div className="event-content">
      <div className="event-title">{event.title}</div>
      {hasLocation && (
        <div className="event-location">📍 {event.location}</div>
      )}
    </div>
  );
};

export default function BigCalendar({ currentDate, setCurrentDate, currentView, setCurrentView, user}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [eventToEdit, setEventToEdit] = useState(null);

  // Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const userId = user?.uid || 'guest';
        const eventsCollection = collection(db, 'users', userId, 'events');
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsList = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          start: doc.data().start?.toDate() || new Date(doc.data().start),
          end: doc.data().end?.toDate() || new Date(doc.data().end)
        }));
        setEvents(eventsList);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const handleEventSelect = (event) => {
    setEventToEdit(event);
    setShowModal(true);
  };

  const handleSlotSelect = (slotInfo) => {
    setEventToEdit(null);
    
    // Create a 1-hour event instead of the default 30-minute slot
    const startTime = slotInfo.start;
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later
    
    const modifiedSlotInfo = {
      ...slotInfo,
      start: startTime,
      end: endTime
    };
    
    setSelectedSlot(modifiedSlotInfo);
    setShowModal(true);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      const userId = user?.uid || 'guest';
      const eventsCollection = collection(db, 'users', userId, 'events');

      if (eventData.delete) {
        // Delete the event from Firestore
        await deleteDoc(doc(db, 'users', userId, 'events', eventData.id));
        setEvents(events.filter(event => event.id !== eventData.id));
      } else if (eventToEdit) {
        // Update existing event in Firestore
        const eventRef = doc(db, 'users', userId, 'events', eventToEdit.id);
        const updateData = {
          title: eventData.title,
          start: eventData.start,
          end: eventData.end,
          location: eventData.location,
          description: eventData.description,
          assistantId: eventData.assistantId,
          reminderAudio: eventData.reminder.soundUrl,
          reminderTime: eventData.reminder.time,
          reminderUnit: eventData.reminder.unit,
          updatedAt: serverTimestamp()
        };
        await updateDoc(eventRef, updateData);
        
        // Update local state
        setEvents(events.map(event => 
          event.id === eventToEdit.id ? { ...event, ...updateData } : event
        ));
      } else {
        // Add new event to Firestore
        const newEventData = {
          title: eventData.title,
          start: eventData.start,
          end: eventData.end,
          location: eventData.location,
          description: eventData.description,
          assistantId: eventData.assistantId,
          reminderAudio: eventData.reminder.soundUrl,
          reminderTime: eventData.reminder.time,
          reminderUnit: eventData.reminder.unit,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        const docRef = await addDoc(eventsCollection, newEventData);
        const newEvent = {
          id: docRef.id,
          ...newEventData,
          start: eventData.start,
          end: eventData.end
        };
        setEvents([...events, newEvent]);
      }
      
      setShowModal(false);
      setEventToEdit(null);
      setSelectedSlot(null);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEventToEdit(null);
    setSelectedSlot(null);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-lg">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        view={currentView}
        onView={(newView) => setCurrentView(newView)}
        onNavigate={(newDate) => setCurrentDate(newDate)}
        selectable={true}
        onSelectSlot={handleSlotSelect}
        onSelectEvent={handleEventSelect}
        views={['month', 'week', 'day']}
        toolbar={true}
        style={{ height: '100%' }}
        components={{
          event: EventComponent
        }}
      />

      {showModal && (
        <EventModal
          slotInfo={selectedSlot}
          eventToEdit={eventToEdit}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
          user={user}
        />
      )}
    </div>
  );
}
