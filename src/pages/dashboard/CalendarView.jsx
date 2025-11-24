import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';

const CalendarView = ({ appointments, onStatusUpdate, onViewPatient }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helper to get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper to get day of week for the first day (0 = Sunday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const days = [];
    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [year, month, daysInMonth, firstDay]);

  // Group appointments by date
  const appointmentsByDate = useMemo(() => {
    const grouped = {};
    appointments.forEach(appt => {
      const dateKey = new Date(appt.startTime).toDateString();
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(appt);
    });
    return grouped;
  }, [appointments]);

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const isToday = (date) => {
    return date && date.toDateString() === new Date().toDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 auto-rows-fr bg-gray-200 gap-px">
        {calendarDays.map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} className="bg-gray-50 min-h-[120px]" />;

          const dateKey = date.toDateString();
          const dayAppointments = appointmentsByDate[dateKey] || [];

          return (
            <div
              key={dateKey}
              className={`bg-white min-h-[120px] p-2 transition-colors hover:bg-blue-50/30 ${isToday(date) ? 'bg-blue-50/50' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full ${isToday(date) ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>
                  {date.getDate()}
                </span>
                {dayAppointments.length > 0 && (
                  <span className="text-xs text-gray-400 font-medium">{dayAppointments.length} appts</span>
                )}
              </div>

              <div className="space-y-1 overflow-y-auto max-h-[100px] custom-scrollbar">
                {dayAppointments.map(appt => (
                  <div
                    key={appt.id}
                    onClick={() => onViewPatient(appt.patient?.id)}
                    className={`text-xs p-1.5 rounded border cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(appt.status)}`}
                  >
                    <div className="flex items-center gap-1 font-semibold truncate">
                      <Clock size={10} />
                      {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="truncate mt-0.5 flex items-center gap-1">
                      <User size={10} />
                      {appt.patient?.id?.slice(-6) || 'Unknown'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
