import { useState } from 'react'
import Login from "./components/LoginPage";
import CalendarPage from "./components/CalendarPage";

function App() {
  const [user, setUser] = useState(undefined);

  const handleLogout = () => {
    setUser(undefined);
  };

  if (user === undefined) {
    return <Login onLogin={setUser} />; // Pass setUser to Login component
  }
  return <CalendarPage user={user} onLogout={handleLogout} />; // Pass user and onLogout to CalendarPage component
}

export default App;
