import React, { useState } from 'react';
import { format } from 'date-fns';
import Calendar from 'react-calendar';

export default function EventModal({ slotInfo, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(slotInfo?.start || new Date());
  const [endTime, setEndTime] = useState(slotInfo?.end || new Date());
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderUnit, setReminderUnit] = useState('minutes');
  const [selectedAssistantId, setSelectedAssistantId] = useState('');
  
  const formattedDate = format(startTime, 'EEEE, MMMM yyyy');

  const handleSave = () => {
    if (!title) return;

    const parsedRemainderTime = parseInt(reminderTime, 10);
    if (isNaN(parsedRemainderTime) || parsedRemainderTime <= 0) {
        alert('Please enter a valid reminder time.');
        return;
    }

    const reminder ={
        time: parsedRemainderTime,
        unit: reminderUnit,
        assistantId: selectedAssistantId || null
    };

    if (!selectedAssistantId) {
        reminder.soundUrl = '../../public/GeminderDefaultRing.mp3';
    }

    const newEvent = {
      title,
      start: startTime,
      end: endTime,
      location,
      description,
      assistantId: selectedAssistantId,
      reminderTime,  
    };
    onSave(newEvent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-lightGray p-4 rounded shadow w-96 bg-opacity-80">
        <h2 className="text-white text-xl font-bold mb-4">Create an Event</h2>

        {/* Title field */}
        <input
          type="text"
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        {/* Date + Time Row */}
    <div className="flex items-center justify-between mb-4 text-white">
        <div className="bg-darkGray px-3 py-2 rounded font-semibold">
            {format(startTime, 'EEEE, MMMM yyyy')}
        </div>

        <input
            type="time"
            value={format(startTime, 'HH:mm')}
            onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':');
                const updated = new Date(startTime);
                updated.setHours(+hours, +minutes);
                setStartTime(updated);
            }}
            className="bg-darkGray px-2 py-1 rounded text-white"
        />

        <span className="text-white px-2">–</span>

  <input
    type="time"
    value={format(endTime, 'HH:mm')}
    onChange={(e) => {
      const [hours, minutes] = e.target.value.split(':');
      const updated = new Date(endTime);
      updated.setHours(+hours, +minutes);
      setEndTime(updated);
    }}
    className="bg-darkGray px-2 py-1 rounded text-white"
  />
</div>

        {/* Location field */}
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        {/* Description field */}
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        {/* Reminder + Notification dropdowns */}
        <div className="flex justify-between space-x-2 mb-4"> 
            <select
                value={selectedAssistantId}
                onChange={(e) => setSelectedAssistantId(e.target.value)}
                className="flex-1 px-2 py-1 rounded bg-darkGray text-white text-sm"
            >
                <option value="" disabled>Select a reminder!</option>
                <option value="../../public/GeminderDefaultRing.mp3">Default</option>
                <option value="">Captain Crunch</option>
            </select>

            <input
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={reminderTime}
            className="w-16 px-2 py-1 rounded bg-darkGray text-white text-sm"
            onChange={(e) => {
                let val = e.target.value;
                if (val === '') {
                    setReminderTime('');
                    return;
                }
                if (/^\d+$/.test(val)) {
                    const cleaned = val.replace(/^0+(?=\d)/, '');
                    setReminderTime(parseInt(cleaned, 10));
                }
            }}
            onKeyDown={(e) => {
                if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                    e.preventDefault();
                }
            }}
        />

            <select
                value={reminderUnit}
                onChange={(e) => setReminderUnit(e.target.value)}
                className="flex-1 px-2 py-1 rounded bg-darkGray text-white text-sm"
            >
                <option value="minutes">minutes</option>
                <option value="hours">hours</option>
                <option value="days">days</option>
                <option value="months">months</option>
            </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
}
