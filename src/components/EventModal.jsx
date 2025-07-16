import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Calendar from 'react-calendar';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';


export default function EventModal({ slotInfo, eventToEdit, onClose, onSave, user }) {
  // Initialize state based on whether we're editing or creating
  const [title, setTitle] = useState(eventToEdit?.title || '');
  const [startTime, setStartTime] = useState(eventToEdit?.start || slotInfo?.start || new Date());
  const [endTime, setEndTime] = useState(eventToEdit?.end || slotInfo?.end || new Date());
  const [location, setLocation] = useState(eventToEdit?.location || '');
  const [description, setDescription] = useState(eventToEdit?.description || '');
  const [reminderTime, setReminderTime] = useState(eventToEdit?.reminder?.time || 15);
  const [reminderUnit, setReminderUnit] = useState(eventToEdit?.reminder?.unit || 'minutes');
  const [selectedAssistantId, setSelectedAssistantId] = useState(eventToEdit?.assistantId || '');
  const [showCalendar, setShowCalendar] = useState(false);
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch assistants from Firestore with timeout
  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        // Set a timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 3000)
        );
        
        // Fetch from user's specific assistants collection
        const userId = user?.uid || 'guest';
        const assistantsCollection = collection(db, 'users', userId, 'assistants');
        const fetchPromise = getDocs(assistantsCollection);
        const assistantsSnapshot = await Promise.race([fetchPromise, timeoutPromise]);
        
        const assistantsList = assistantsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAssistants(assistantsList);
      } catch (error) {
        console.error('Error fetching assistants:', error);
        // Fallback to default assistants if Firestore fails
        setAssistants([
          { id: 'default', name: 'Default', voiceId: null }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssistants();
  }, [user]);

  const handleSave = () => {
    // Validate required fields
    if (!title.trim()) {
      alert('Please enter an event title.');
      return;
    }

    // Validate time consistency
    if (startTime >= endTime) {
      alert('End time must be after start time.');
      return;
    }

    // Validate reminder time
    const parsedReminderTime = parseInt(reminderTime, 10);
    if (isNaN(parsedReminderTime) || parsedReminderTime <= 0) {
      alert('Please enter a valid reminder time.');
      return;
    }

    // Build reminder object
    const reminder = {
      time: parsedReminderTime,
      unit: reminderUnit,
      assistantId: selectedAssistantId || null
    };

    // Set reminder sound URL
    const getReminderSoundUrl = () => {
      if (!selectedAssistantId || selectedAssistantId === 'default') {
        return '/GeminderDefaultRing.mp3';
      }
      const selectedAssistant = assistants.find(a => a.id === selectedAssistantId);
      return selectedAssistant?.voiceId || '/GeminderDefaultRing.mp3';
    };
    
    reminder.soundUrl = getReminderSoundUrl();

    const eventData = {
      title: title.trim(),
      start: startTime,
      end: endTime,
      location: location.trim(),
      description: description.trim(),
      assistantId: selectedAssistantId || null,
      reminder
    };

    // If editing, include the original event ID
    if (eventToEdit?.id) {
      eventData.id = eventToEdit.id;
    }

    onSave(eventData);
  };

  const handleDateSelect = (date) => {
    const updateTime = (time) => {
      const newTime = new Date(time);
      newTime.setFullYear(date.getFullYear());
      newTime.setMonth(date.getMonth());
      newTime.setDate(date.getDate());
      return newTime;
    };
    
    setStartTime(updateTime(startTime));
    setEndTime(updateTime(endTime));
    setShowCalendar(false);
  };

  const handleTimeChange = (timeString, isStartTime) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const targetTime = isStartTime ? startTime : endTime;
    
    const updated = new Date(targetTime);
    updated.setHours(hours, minutes);
    
    if (isStartTime) {
      setStartTime(updated);
      // Ensure end time is after start time
      if (updated >= endTime) {
        const newEndTime = new Date(updated);
        newEndTime.setHours(updated.getHours() + 1);
        setEndTime(newEndTime);
      }
    } else {
      setEndTime(updated);
    }
  };

  const handleReminderTimeChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      setReminderTime('');
      return;
    }
    const numVal = parseInt(val.replace(/^0+(?=\d)/, ''), 10);
    if (numVal > 0) {
      setReminderTime(numVal);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
        <div className="bg-lightGray p-4 rounded shadow w-96 bg-opacity-80">
          <div className="text-white text-center">Loading assistants...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-lightGray p-4 rounded shadow w-96 bg-opacity-80 max-h-[90vh] overflow-y-auto z-50">
        <h2 className="text-white text-xl font-bold mb-4">
          {eventToEdit ? 'Edit Event' : 'Create an Event'}
        </h2>

        {/* Title field */}
        <input
          type="text"
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-4 bg-white"
          required
        />

        {/* Date and Time Selection */}
        <div className="mb-4">
          {/* Date Field */}
          <div className="relative mb-2">
            <button
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full bg-darkGray px-3 py-2 rounded font-semibold text-white text-left"
            >
              {format(startTime, 'EEEE, MMMM yyyy')}
            </button>
            {showCalendar && (
              <div className="absolute top-full left-0 mt-1 z-10 bg-white rounded shadow-lg">
                <Calendar
                  onChange={handleDateSelect}
                  value={startTime}
                  className="rounded"
                />
              </div>
            )}
          </div>

          {/* Time Fields */}
          <div className="flex items-center space-x-2">
            <input
              type="time"
              value={format(startTime, 'HH:mm')}
              onChange={(e) => handleTimeChange(e.target.value, true)}
              className="flex-1 bg-darkGray px-2 py-1 rounded text-white"
            />
            <span className="text-white px-2">–</span>
            <input
              type="time"
              value={format(endTime, 'HH:mm')}
              onChange={(e) => handleTimeChange(e.target.value, false)}
              className="flex-1 bg-darkGray px-2 py-1 rounded text-white"
            />
          </div>
        </div>

        {/* Location field */}
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded mb-4 bg-white"
        />

        {/* Description field */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-4 bg-white resize-none"
          rows="3"
        />

        {/* Reminder Section */}
        <div className="flex items-center space-x-2 mb-4">
          <select
            value={selectedAssistantId || ''}
            onChange={(e) => setSelectedAssistantId(e.target.value)}
            className="flex-1 px-2 py-1 rounded bg-darkGray text-white text-sm"
          >
            <option value="" disabled>Select a reminder!</option>
            <option value="default">Default</option>
            {assistants.map(assistant => (
              <option key={assistant.id} value={assistant.id}>
                {assistant.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={reminderTime}
            onChange={handleReminderTimeChange}
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            className="w-16 px-2 py-1 rounded bg-darkGray text-white text-sm"
            placeholder="15"
          />

          <select
            value={reminderUnit}
            onChange={(e) => setReminderUnit(e.target.value)}
            className="flex-1 px-2 py-1 rounded bg-darkGray text-white text-sm"
          >
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
            <option value="days">days</option>
            <option value="weeks">weeks</option>
          </select>
        </div>

        {/* Save, Delete, and Cancel Buttons */}
        <div className="flex justify-between items-center mt-8">
          <div>
            {eventToEdit && (
              <button 
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this event?')) {
                    onSave({ ...eventToEdit, delete: true });
                  }
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
