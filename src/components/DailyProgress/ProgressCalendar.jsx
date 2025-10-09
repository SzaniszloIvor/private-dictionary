// src/components/DailyProgress/ProgressCalendar.jsx
import React, { useState, useEffect } from 'react';
import { useStatsHistory } from '../../hooks/useStatsHistory';

const ProgressCalendar = () => {
  const { getCalendarData, loading } = useStatsHistory('month');
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [calendarData, setCalendarData] = useState([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Load calendar data for current month
  useEffect(() => {
    if (!loading) {
      const data = getCalendarData(year, month);
      setCalendarData(data);
    }
  }, [year, month, loading, getCalendarData]);

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1));
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    const today = new Date();
    if (year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth())) {
      setCurrentDate(new Date(year, month + 1));
      setSelectedDay(null);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(null);
  };

  // Get color for day based on words learned
  const getDayColor = (wordsLearned, goalAchieved) => {
    if (wordsLearned === 0) {
      return 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
    if (goalAchieved || wordsLearned >= 10) {
      return 'bg-green-500 dark:bg-green-600 border-green-600 dark:border-green-700';
    }
    if (wordsLearned >= 5) {
      return 'bg-yellow-400 dark:bg-yellow-500 border-yellow-500 dark:border-yellow-600';
    }
    return 'bg-blue-300 dark:bg-blue-400 border-blue-400 dark:border-blue-500';
  };

  // Check if day is today
  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  // Check if day is in future
  const isFuture = (day) => {
    const today = new Date();
    const dayDate = new Date(year, month, day);
    return dayDate > today;
  };

  // Get month name
  const monthName = new Date(year, month).toLocaleDateString('hu-HU', { 
    month: 'long', 
    year: 'numeric' 
  });

  // Day names
  const dayNames = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'];

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Monday = 0

  // Calculate grid layout
  const weeks = [];
  let currentWeek = Array(adjustedFirstDay).fill(null);

  calendarData.forEach((dayData) => {
    currentWeek.push(dayData);
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span className="text-2xl">📅</span>
          <span>Havi Naptár</span>
        </h3>
        
        <button
          onClick={goToToday}
          className="
            px-3 py-1 rounded-lg text-sm font-medium
            bg-blue-500 hover:bg-blue-600
            text-white
            transition-colors duration-200
          "
        >
          Ma
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPreviousMonth}
          className="
            text-gray-600 dark:text-gray-400
            hover:text-blue-500 dark:hover:text-blue-400
            transition-colors duration-200
            text-2xl font-bold
          "
          title="Előző hónap"
        >
          ‹
        </button>
        
        <div className="text-lg font-bold text-gray-800 dark:text-gray-100 capitalize">
          {monthName}
        </div>
        
        <button
          onClick={goToNextMonth}
          disabled={month === new Date().getMonth() && year === new Date().getFullYear()}
          className="
            text-gray-600 dark:text-gray-400
            hover:text-blue-500 dark:hover:text-blue-400
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-colors duration-200
            text-2xl font-bold
          "
          title="Következő hónap"
        >
          ›
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="mb-4">
        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="
                text-center text-xs font-medium
                text-gray-500 dark:text-gray-400
                py-1
              "
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((dayData, dayIndex) => {
                if (!dayData) {
                  return <div key={dayIndex} className="aspect-square" />;
                }

                const isSelectedDay = selectedDay === dayData.day;
                const isTodayDay = isToday(dayData.day);
                const isFutureDay = isFuture(dayData.day);

                return (
                  <button
                    key={dayIndex}
                    onClick={() => setSelectedDay(isSelectedDay ? null : dayData.day)}
                    disabled={isFutureDay}
                    className={`
                      aspect-square rounded-lg
                      border-2
                      flex items-center justify-center
                      text-xs font-medium
                      transition-all duration-200
                      ${isFutureDay 
                        ? 'opacity-30 cursor-not-allowed' 
                        : 'hover:scale-110 hover:shadow-lg cursor-pointer'}
                      ${getDayColor(dayData.wordsLearned, dayData.goalAchieved)}
                      ${isSelectedDay 
                        ? 'ring-4 ring-blue-500 dark:ring-blue-400 scale-110' 
                        : ''}
                      ${isTodayDay 
                        ? 'ring-2 ring-purple-500 dark:ring-purple-400' 
                        : ''}
                    `}
                    title={`${dayData.day}. nap - ${dayData.wordsLearned} szó`}
                  >
                    <span className={
                      dayData.wordsLearned > 0 
                        ? 'text-white font-bold' 
                        : 'text-gray-500 dark:text-gray-400'
                    }>
                      {dayData.day}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400 mb-4">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700"></div>
          <span>Nincs</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-blue-300 dark:bg-blue-400 border-2 border-blue-400 dark:border-blue-500"></div>
          <span>1-4</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-yellow-400 dark:bg-yellow-500 border-2 border-yellow-500 dark:border-yellow-600"></div>
          <span>5-9</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-green-500 dark:bg-green-600 border-2 border-green-600 dark:border-green-700"></div>
          <span>10+</span>
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDay && calendarData.find(d => d.day === selectedDay) && (
        <div className="
          bg-gradient-to-r from-blue-50 to-indigo-50
          dark:from-blue-900/20 dark:to-indigo-900/20
          border-2 border-blue-200 dark:border-blue-800
          rounded-lg p-4
          animate-slide-in-up
        ">
          {(() => {
            const dayDetails = calendarData.find(d => d.day === selectedDay);
            return (
              <>
                <div className="font-bold text-blue-800 dark:text-blue-300 mb-2">
                  {year}. {month + 1}. {selectedDay}.
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Szavak</div>
                    <div className="font-bold text-gray-800 dark:text-gray-100">
                      {dayDetails.wordsLearned}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Gyakorlások</div>
                    <div className="font-bold text-gray-800 dark:text-gray-100">
                      {dayDetails.practiceSessionsCompleted}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Idő</div>
                    <div className="font-bold text-gray-800 dark:text-gray-100">
                      {Math.round(dayDetails.timeSpentMinutes)} perc
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Cél</div>
                    <div className="font-bold">
                      {dayDetails.goalAchieved 
                        ? <span className="text-green-600 dark:text-green-400">✓ Elérve</span>
                        : <span className="text-orange-600 dark:text-orange-400">✗ Nem</span>
                      }
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default ProgressCalendar;
