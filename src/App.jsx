import { useState } from 'react'
import Login from "./components/LoginPage";
import CalendarPage from "./components/CalendarPage";

function App() {
  const [user, setUser] = useState(undefined);

  if (user === undefined) {
    return <Login onLogin={setUser} />; // Pass setUser to Login component
  }
  return <CalendarPage user={user} />; // Pass user to CalendarPage component
}

export default App;
