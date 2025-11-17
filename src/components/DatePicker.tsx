'use client';

import { useState } from 'react';

interface DatePickerProps {
  onSelectDate: (date: string) => void; // ISO date string
  minDate?: Date;
  maxDate?: Date;
}

export default function DatePicker({ onSelectDate, minDate, maxDate }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const min = minDate || today;
  const max = maxDate || (() => {
    const fourWeeksOut = new Date(today);
    fourWeeksOut.setDate(fourWeeksOut.getDate() + 28);
    return fourWeeksOut;
  })();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); // 0 = Sunday

    const days: (Date | null)[] = [];

    // Add empty slots for days before month starts
    // Adjust so Monday is first (0)
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;
    for (let i = 0; i < adjustedStartDay; i++) {
      days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isDateSelectable = (date: Date | null): boolean => {
    if (!date) return false;
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    return dateOnly >= min && dateOnly <= max;
  };

  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    return date.toDateString() === today.toDateString();
  };

  const handleDateClick = (date: Date | null) => {
    if (!date || !isDateSelectable(date)) return;
    const isoDate = date.toISOString().split('T')[0];
    onSelectDate(isoDate);
  };

  const canGoPrevious = () => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    return prevMonth >= new Date(min.getFullYear(), min.getMonth());
  };

  const canGoNext = () => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    return nextMonth <= new Date(max.getFullYear(), max.getMonth());
  };

  return (
    <div className="date-picker">
      <div className="date-picker-header">
        <button
          onClick={goToPreviousMonth}
          disabled={!canGoPrevious()}
          className="month-nav"
          aria-label="Previous month"
        >
          ‹
        </button>
        <div className="current-month">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <button
          onClick={goToNextMonth}
          disabled={!canGoNext()}
          className="month-nav"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="date-picker-weekdays">
        <div className="weekday">Mon</div>
        <div className="weekday">Tue</div>
        <div className="weekday">Wed</div>
        <div className="weekday">Thu</div>
        <div className="weekday">Fri</div>
        <div className="weekday">Sat</div>
        <div className="weekday">Sun</div>
      </div>

      <div className="date-picker-days">
        {days.map((date, index) => {
          const selectable = isDateSelectable(date);
          const isCurrentDay = isToday(date);

          return (
            <button
              key={index}
              className={`date-day ${!date ? 'empty' : ''} ${selectable ? 'selectable' : 'disabled'} ${isCurrentDay ? 'today' : ''}`}
              onClick={() => handleDateClick(date)}
              disabled={!selectable}
            >
              {date ? date.getDate() : ''}
            </button>
          );
        })}
      </div>
    </div>
  );
}
