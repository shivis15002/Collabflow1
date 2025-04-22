
import React from 'react';
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar3DButton } from './Calendar3DButton';
import { format, isSameDay } from "date-fns";

type Calendar3DProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  datesWithNotes: Set<string>;
  className?: string;
};

export function Calendar3D({ value, onChange, datesWithNotes, className }: Calendar3DProps) {
  const today = new Date();
  const currentMonth = value ? value.getMonth() : today.getMonth();
  const currentYear = value ? value.getFullYear() : today.getFullYear();
  
  // Get the first day of the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dayOfWeekStart = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
  
  // Create arrays for calendar display
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Navigate to previous month
  const prevMonth = () => {
    if (value) {
      const newDate = new Date(value);
      newDate.setMonth(newDate.getMonth() - 1);
      onChange?.(newDate);
    } else {
      const newDate = new Date();
      newDate.setMonth(newDate.getMonth() - 1);
      onChange?.(newDate);
    }
  };
  
  // Navigate to next month
  const nextMonth = () => {
    if (value) {
      const newDate = new Date(value);
      newDate.setMonth(newDate.getMonth() + 1);
      onChange?.(newDate);
    } else {
      const newDate = new Date();
      newDate.setMonth(newDate.getMonth() + 1);
      onChange?.(newDate);
    }
  };
  
  const handleDateClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    onChange?.(newDate);
  };
  
  // Check if a date has notes
  const dateHasNotes = (day: number) => {
    const dateString = format(new Date(currentYear, currentMonth, day), "yyyy-MM-dd");
    return datesWithNotes.has(dateString);
  };
  
  // Check if a date is today
  const isToday = (day: number) => {
    const dateToCheck = new Date(currentYear, currentMonth, day);
    return isSameDay(dateToCheck, today);
  };
  
  // Check if a date is selected
  const isSelected = (day: number) => {
    if (!value) return false;
    const dateToCheck = new Date(currentYear, currentMonth, day);
    return isSameDay(dateToCheck, value);
  };
  
  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
          <span className="font-medium">{format(new Date(currentYear, currentMonth), "MMMM yyyy")}</span>
        </div>
        
        <div className="flex gap-1">
          <button 
            onClick={prevMonth} 
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Previous month"
          >
            ◀
          </button>
          <button 
            onClick={nextMonth} 
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Next month"
          >
            ▶
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the first day of month */}
        {Array.from({ length: dayOfWeekStart }).map((_, index) => (
          <div key={`empty-start-${index}`} className="w-9 h-9"></div>
        ))}
        
        {/* Actual days */}
        {daysArray.map(day => (
          <div key={`day-${day}`}>
            <Calendar3DButton 
              day={day} 
              hasNotes={dateHasNotes(day)} 
              isToday={isToday(day)}
              isSelected={isSelected(day)}
              onClick={() => handleDateClick(day)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
