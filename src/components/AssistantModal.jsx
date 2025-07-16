import { useState } from 'react';
import { db } from '../firebase'; // adjust path if needed
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AssistantModal({ onClose, user, onAssistantCreated, onShowNotification }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [emotion, setEmotion] = useState('');
  const [voiceId, setVoiceId] = useState('');

  // Role to emoji mapping
  const roleEmojis = {
    'Pirate': '🏴‍☠️',
    'Clown': '🤡',
    'Vampire': '🧛🏼‍♂️',
    'Soldier': '🪖',
    'Royalty': '👑',
    'Surfer': '🏄',
    'Cowboy': '🤠',
    'Professor': '👨‍🏫'
  };

  const handleCreate = async () => {
    // Validate all required fields
    if (!name.trim()) {
      alert('Please enter an assistant name.');
      return;
    }
    if (!role) {
      alert('Please select a role.');
      return;
    }
    if (!emotion) {
      alert('Please select an emotion.');
      return;
    }
    if (!voiceId) {
      alert('Please select a voice.');
      return;
    }

    try {
      // Get the emoji for the selected role
      const roleEmoji = roleEmojis[role] || '';
      
      // Combine emoji with name
      const fullName = roleEmoji + ' ' + name.trim();
      
      const newAssistant = {
        name: fullName,
        role,
        emotion,
        voiceId,
        createdAt: serverTimestamp(),
      };

      // Use user.uid if user exists, otherwise use a guest ID
      const userId = user?.uid || 'guest';
      console.log('Creating assistant with data:', newAssistant);
      console.log('User ID:', userId);
      
      const assistantsCollection = collection(db, 'users', userId, 'assistants');
      console.log('Collection path:', `users/${userId}/assistants`);
      
      const docRef = await addDoc(assistantsCollection, newAssistant);
      console.log('Assistant created successfully with ID:', docRef.id);
      
      // Call the callback to refresh the assistants list
      if (onAssistantCreated) {
        onAssistantCreated();
      }
      
      onClose(); // close modal
      
      // Call the callback to show notification after modal closes
      if (onShowNotification) {
        onShowNotification('Assistant created!', 'green');
      }
    } catch (error) {
      console.error('Error creating assistant:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error);
      alert(`Failed to create assistant: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow w-96 z-50">
        <h2 className="text-xl font-semibold mb-4">Create Assistant</h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Assistant name"
          className="w-full p-2 border rounded mb-4"
        />

        {/* Role selection — replace with emojis or cards */}
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded mb-4">
          <option value="">Select a role</option>
          <option value="Pirate">🏴‍☠️ - Pirate</option>
          <option value="Clown">🤡 - Clown</option>
          <option value="Vampire">🧛🏼‍♂️ - Vampire</option>
          <option value="Soldier">🪖 - Soldier</option>
          <option value="Royalty">👑 - Royalty</option>
          <option value="Surfer">🏄 - Surfer</option>
          <option value="Cowboy">🤠 - Cowboy</option>
          <option value="Professor">👨‍🏫 - Professor</option>
          {/* add more */}
        </select>

        {/* Emotion selection */}
        <select value={emotion} onChange={(e) => setEmotion(e.target.value)} className="w-full p-2 border rounded mb-4">
          <option value="">Select an emotion</option>
          <option value="happy">🙂 - Happy</option>
          <option value="excited">😆 - Excited</option>
          <option value="calm">😌 - Calm</option>
          <option value="tired">🥱 - Tired/Sleepy</option>
          <option value="bored">😐 - Bored/Monotone</option>
          <option value="angry">😡 - Angry</option>
          <option value="nervous">😰 - Nervous</option>
          <option value="scared">😱 - Scared</option>
        </select>

        {/* Voice selection */}
        <select value={voiceId} onChange={(e) => setVoiceId(e.target.value)} className="w-full p-2 border rounded mb-4">
          <option value="">Select a voice</option>
          <option value="en-US-Chirp3-HD-Achernar">Achernar – Soft, Higher pitch</option>
          <option value="en-US-Chirp3-HD-Laomedeia">Laomedeia – Upbeat, Higher pitch</option>
          <option value="en-US-Chirp3-HD-Leda">Leda – Youthful, Higher pitch</option>
          <option value="en-US-Chirp3-HD-Zephyr">Zephyr – Bright, Higher pitch</option>
          <option value="en-US-Chirp3-HD-Aoede">Aoede – Breezy, Mid pitch</option>
          <option value="en-US-Chirp3-HD-Callirrhoe">Callirrhoe – Easy-going, Mid pitch</option>
          <option value="en-US-Chirp3-HD-Despina">Despina – Smooth, Mid pitch</option>
          <option value="en-US-Chirp3-HD-Erinome">Erinome – Clear, Mid pitch</option>
          <option value="en-US-Chirp3-HD-Kore">Kore – Firm, Mid pitch</option>
          <option value="en-US-Chirp3-HD-Pulcherrima">Pulcherrima – Forward, Mid pitch</option>
          <option value="en-US-Chirp3-HD-Rasalgethi">Rasalgethi – Informative, Mid pitch</option>
          <option value="en-US-Chirp3-HD-Sadaltager">Sadaltager – Knowledgeable, Mid pitch</option>
          <option value="en-US-Chirp3-HD-Sadachbia">Sadachbia – Lively, Mid pitch</option>
          <option value="en-US-Chirp3-HD-Schedar">Schedar – Even, Mid pitch</option>
          <option value="en-US-Chirp3-HD-Sulafat">Sulafat – Warm, Mid pitch</option>
          <option value="en-US-Chirp3-HD-Vindemiatrix">Vindemiatrix – Casual, Mid pitch</option>
          <option value="en-US-Chirp3-HD-Achird">Achird – Friendly, Lower Mid pitch</option>
          <option value="en-US-Chirp3-HD-Charon">Charon – Informative, Lower Mid pitch</option>
          <option value="en-US-Chirp3-HD-Iapetus">Iapetus – Clear, Lower Mid pitch</option>
          <option value="en-US-Chirp3-HD-Orus">Orus – Firm, Lower Mid pitch</option>
          <option value="en-US-Chirp3-HD-Umbriel">Umbriel – Easy-going, Lower Mid pitch</option>
          <option value="en-US-Chirp3-HD-Zubenelgenubi">Zubenelgenubi – Casual, Lower Mid pitch</option>
        </select>

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button onClick={handleCreate} className="bg-green-500 text-white px-4 py-2 rounded">Create</button>
        </div>
      </div>
    </div>
  );
}
