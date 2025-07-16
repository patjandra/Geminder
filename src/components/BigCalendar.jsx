import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/BigCalendarStyles.css';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function BigCalendar({ currentDate, setCurrentDate, currentView, setCurrentView}) {
  const [events] = useState([
    {
      title: 'New Event',
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000),
    },
  ]);

  return (
    <div className="h-full">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        onNavigate={(newDate) => setCurrentDate(newDate)}
        view={currentView}
        onView={(newView) => setCurrentView(newView)}
        views={['month', 'week', 'day']}
        toolbar={true}
        style={{ height: '100%' }}
      />
    </div>
  );
}
