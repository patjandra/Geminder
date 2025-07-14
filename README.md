# Geminder 🗓️🔔

Geminder is a real-time calendar web application that helps users manage events with assistant-driven audio reminders powered by Google Gemini and Google Cloud Text-to-Speech. 

---

## 🚀 Features

- **Weekly calendar UI** powered by FullCalendar
- **Custom assistants** with:
  - Role (e.g., 🎓 Scholar, 🧘 Calm Guide)
  - Emotion (e.g., Cheerful, Calm)
  - Voice (Gemini TTS ID mapped to name/description)
- **Google Sign-In** via Firebase Auth
- **Google Calendar import** on login (read-only, no writeback)
- **Event creation/editing/deletion**
- **Audio notifications** generated via Gemini + TTS, expires after 10 minutes
- **Recurring events** with flexible repeat settings
- **Timezone selection**, defaulting to Pacific
- **Offline guest access** ("Continue without logging in")
- **Responsive UI**, optimized for desktop use

---

## 🔧 Tech Stack

- **Frontend**: Vite + React + Tailwind CSS
- **Authentication**: Firebase Auth (Google OAuth 2.0)
- **Database**: Firestore
- **Hosting**: Firebase Hosting
- **Functions**: Firebase Functions (Node.js)
- **Audio Reminder Logic**:
  - Gemini API prompt → Gemini reply → TTS generation → mp3 playback

---

## 📁 Project Structure

```
geminder/
├── public/                 # Default audio reminder
│   └── GeminderDefaultRing.mp3
├── src/
│   ├── components/         # React components (LoginPage, Calendar, etc.)
│   ├── firebase.js         # Firebase app, auth, db config
│   ├── index.css           # Tailwind CSS base + custom styles
│   ├── App.jsx             # Main app logic and layout
│   └── main.jsx            # React DOM root
├── functions/              # Firebase cloud functions
├── .firebaserc
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🧪 Running Locally

### 1. Clone and install dependencies
```bash
git clone https://github.com/yourusername/geminder.git
cd geminder
npm install
```

### 2. Start development server
```bash
npm run dev
```

### 3. Firebase setup
Ensure you've initialized Firebase:
```bash
firebase login
firebase init
```

---

## 🔐 Environment & API Keys

Configure `firebase.js` with your Firebase project config.
For Gemini and TTS APIs, use Firebase Functions to call your APIs securely.

---

## 📌 Notes

- Audio reminders only play when the tab is open and the user has clicked "Start Session"
- Events are dimmed after they pass
- No push notifications or settings page in MVP
- Gemini prompt failures silently fallback to default ring
- Recurring events only generated up to 90 days ahead

---

## 📬 Contributions

Pull requests and feedback are welcome! This is an MVP and more features will follow.

---
