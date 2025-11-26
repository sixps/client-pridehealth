'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FormField } from '@/types/form';

interface CalendarBookingProps {
  field: FormField;
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  timezone: string;
}

interface CalendarDay {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isSelected: boolean;
  timeSlots: TimeSlot[];
}

export function CalendarBooking({ field, value, onChange, error }: CalendarBookingProps) {
  const { attributes, settings } = field;
  const label = settings.label || settings.admin_field_label || attributes.name;
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [userTimezone, setUserTimezone] = useState<string>('');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isTimezoneDropdownOpen, setIsTimezoneDropdownOpen] = useState(false);
  const [timezoneSearchTerm, setTimezoneSearchTerm] = useState('');

  // Global timezones ordered by UTC offset with international standard names
  const timezones = [
    { value: 'Pacific/Midway', label: '(UTC-11) Samoa Standard Time' },
    { value: 'Pacific/Honolulu', label: '(UTC-10) Hawaii-Aleutian Standard Time' },
    { value: 'America/Anchorage', label: '(UTC-9) Alaska Standard Time' },
    { value: 'America/Los_Angeles', label: '(UTC-8) US Pacific Standard Time' },
    { value: 'America/Denver', label: '(UTC-7) US Mountain Standard Time' },
    { value: 'America/Chicago', label: '(UTC-6) US Central Standard Time' },
    { value: 'America/New_York', label: '(UTC-5) US Eastern Standard Time' },
    { value: 'America/Caracas', label: '(UTC-4) Venezuela Time' },
    { value: 'America/St_Johns', label: '(UTC-3:30) Newfoundland Standard Time' },
    { value: 'America/Sao_Paulo', label: '(UTC-3) Brasília Time' },
    { value: 'America/Argentina/Buenos_Aires', label: '(UTC-3) Argentina Time' },
    { value: 'Atlantic/South_Georgia', label: '(UTC-2) South Georgia Time' },
    { value: 'Atlantic/Azores', label: '(UTC-1) Azores Time' },
    { value: 'UTC', label: '(UTC+0) Coordinated Universal Time' },
    { value: 'Europe/London', label: '(UTC+0) Greenwich Mean Time' },
    { value: 'Africa/Lagos', label: '(UTC+1) West Africa Time' },
    { value: 'Europe/Paris', label: '(UTC+1) Central European Time' },
    { value: 'Europe/Athens', label: '(UTC+2) Eastern European Time' },
    { value: 'Africa/Nairobi', label: '(UTC+3) East Africa Time' },
    { value: 'Europe/Moscow', label: '(UTC+3) Moscow Standard Time' },
    { value: 'Asia/Tehran', label: '(UTC+3:30) Iran Standard Time' },
    { value: 'Asia/Dubai', label: '(UTC+4) Gulf Standard Time' },
    { value: 'Asia/Kabul', label: '(UTC+4:30) Afghanistan Time' },
    { value: 'Asia/Karachi', label: '(UTC+5) Pakistan Standard Time' },
    { value: 'Asia/Kolkata', label: '(UTC+5:30) India Standard Time' },
    { value: 'Asia/Kathmandu', label: '(UTC+5:45) Nepal Time' },
    { value: 'Asia/Dhaka', label: '(UTC+6) Bangladesh Standard Time' },
    { value: 'Asia/Yangon', label: '(UTC+6:30) Myanmar Time' },
    { value: 'Asia/Bangkok', label: '(UTC+7) Indochina Time' },
    { value: 'Asia/Singapore', label: '(UTC+8) Singapore Standard Time' },
    { value: 'Asia/Shanghai', label: '(UTC+8) China Standard Time' },
    { value: 'Asia/Tokyo', label: '(UTC+9) Japan Standard Time' },
    { value: 'Asia/Seoul', label: '(UTC+9) Korea Standard Time' },
    { value: 'Australia/Adelaide', label: '(UTC+9:30) Australian Central Standard Time' },
    { value: 'Australia/Sydney', label: '(UTC+10) Australian Eastern Standard Time' },
    { value: 'Pacific/Guam', label: '(UTC+10) Chamorro Standard Time' },
    { value: 'Australia/Lord_Howe', label: '(UTC+10:30) Lord Howe Standard Time' },
    { value: 'Pacific/Noumea', label: '(UTC+11) New Caledonia Time' },
    { value: 'Pacific/Norfolk', label: '(UTC+11) Norfolk Island Time' },
    { value: 'Pacific/Auckland', label: '(UTC+12) New Zealand Standard Time' },
    { value: 'Pacific/Fiji', label: '(UTC+12) Fiji Standard Time' },
    { value: 'Pacific/Chatham', label: '(UTC+12:45) Chatham Standard Time' },
    { value: 'Pacific/Tongatapu', label: '(UTC+13) Tonga Time' },
    { value: 'Pacific/Kiritimati', label: '(UTC+14) Line Islands Time' },
  ];

  // Detect user's timezone
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(timezone);
    setSelectedTimezone(timezone);
  }, []);

  // Generate fake available time slots
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        // Randomly make some slots unavailable for demo
        const available = Math.random() > 0.3;
        slots.push({
          time,
          available,
          timezone: selectedTimezone
        });
      }
    }
    
    return slots;
  };

  // Generate calendar days for the current month
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    
    const days: CalendarDay[] = [];
    
    // Add days from previous month to fill the week
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        isToday: false,
        isSelected: false,
        timeSlots: []
      });
    }
    
    // Add days of current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isPast = date < today;
      
      days.push({
        date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: day,
        isToday,
        isSelected,
        timeSlots: !isPast ? generateTimeSlots(date) : []
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateSelect = (day: CalendarDay) => {
    if (day.timeSlots.length === 0) return; // Can't select past dates
    setSelectedDate(day.date);
    setSelectedTime(''); // Reset time selection
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      const appointmentValue = `${selectedDate.toISOString().split('T')[0]} ${time} ${selectedTimezone}`;
      onChange(attributes.name, appointmentValue);
    }
  };

  const handleTimezoneChange = (timezone: string) => {
    setSelectedTimezone(timezone);
    setIsTimezoneDropdownOpen(false);
    setTimezoneSearchTerm('');
    // Update appointment value if both date and time are selected
    if (selectedDate && selectedTime) {
      const appointmentValue = `${selectedDate.toISOString().split('T')[0]} ${selectedTime} ${timezone}`;
      onChange(attributes.name, appointmentValue);
    }
  };

  // Filter timezones based on search term
  const filteredTimezones = timezones.filter(tz =>
    tz.label.toLowerCase().includes(timezoneSearchTerm.toLowerCase()) ||
    tz.value.toLowerCase().includes(timezoneSearchTerm.toLowerCase())
  );

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  return (
    <div className="space-y-6">
      {label && (
        <motion.label
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="block font-medium mb-2"
          style={{ 
            fontSize: '17px', 
            fontWeight: 500, 
            color: '#000000' 
          }}
        >
          {label}
          {attributes.required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-200 rounded-xl p-4"
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <motion.button
              type="button"
              onClick={() => navigateMonth('prev')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            
            <h3 className="text-lg font-semibold" style={{ color: '#000000' }}>
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            
            <motion.button
              type="button"
              onClick={() => navigateMonth('next')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium p-2" style={{ color: '#858b8b' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => handleDateSelect(day)}
                disabled={day.timeSlots.length === 0}
                whileHover={day.timeSlots.length > 0 ? { scale: 1.05 } : {}}
                whileTap={day.timeSlots.length > 0 ? { scale: 0.95 } : {}}
                className={`
                  p-2 text-sm rounded-lg transition-all duration-200
                  ${day.timeSlots.length === 0 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'cursor-pointer hover:bg-gray-50'
                  }
                  ${day.isSelected ? 'text-white' : ''}
                  ${day.isToday && !day.isSelected ? 'ring-2 ring-offset-1' : ''}
                `}
                style={{
                  backgroundColor: day.isSelected ? '#f8981d' : 'transparent',
                  color: day.isSelected ? '#ffffff' : (day.timeSlots.length === 0 ? '#d1d5db' : '#000000'),
                  ringColor: day.isToday ? '#ffbc00' : 'transparent'
                }}
              >
                {day.dayNumber}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Time Slots */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-gray-200 rounded-xl p-4"
        >
          <h4 className="text-lg font-semibold mb-4" style={{ color: '#000000' }}>
            {selectedDate 
              ? `Available Times - ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`
              : 'Select a Date'
            }
          </h4>

          <AnimatePresence mode="wait">
            {selectedDate ? (
              <motion.div
                key="time-slots"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto"
              >
                {calendarDays
                  .find(day => day.date.toDateString() === selectedDate.toDateString())
                  ?.timeSlots.map((slot, index) => (
                    <motion.button
                      key={slot.time}
                      type="button"
                      onClick={() => slot.available && handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={slot.available ? { scale: 1.02 } : {}}
                      whileTap={slot.available ? { scale: 0.98 } : {}}
                      className={`
                        p-3 text-sm rounded-lg border transition-all duration-200
                        ${!slot.available 
                          ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200' 
                          : selectedTime === slot.time
                            ? 'text-white border-transparent'
                            : 'hover:border-orange-200 border-gray-200'
                        }
                      `}
                      style={{
                        backgroundColor: selectedTime === slot.time 
                          ? '#f8981d' 
                          : slot.available 
                            ? '#ffffff' 
                            : '#f9fafb',
                        color: selectedTime === slot.time 
                          ? '#ffffff' 
                          : slot.available 
                            ? '#000000' 
                            : '#9ca3af'
                      }}
                    >
                      {slot.time}
                      {selectedTime === slot.time && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-1 inline-block"
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.button>
                  ))
                }
              </motion.div>
            ) : (
              <motion.div
                key="no-date"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
                style={{ color: '#858b8b' }}
              >
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>Please select a date to view available times</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        </div>

        {/* Timezone Selection - moved below calendar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border"
          style={{ 
            backgroundColor: '#f9fafb', 
            borderColor: '#e5e7eb'
          }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm" style={{ color: '#6b7280' }}>
              Timezone:
            </span>
          </div>
          
          <div className="flex-1 max-w-sm relative">
            <div className="relative">
              <motion.input
                type="text"
                value={isTimezoneDropdownOpen ? timezoneSearchTerm : (timezones.find(tz => tz.value === selectedTimezone)?.label || '')}
                onChange={(e) => {
                  setTimezoneSearchTerm(e.target.value);
                  if (!isTimezoneDropdownOpen) {
                    setIsTimezoneDropdownOpen(true);
                  }
                }}
                onFocus={() => {
                  setIsTimezoneDropdownOpen(true);
                  setTimezoneSearchTerm('');
                }}
                placeholder="Search timezones..."
                whileFocus={{ 
                  scale: 1.01,
                  y: -1
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-full px-3 py-2 pr-8 text-sm border bg-white transition-all duration-200 cursor-pointer"
                style={{
                  borderRadius: '6px',
                  color: '#374151',
                  fontSize: '13px',
                  borderColor: isTimezoneDropdownOpen ? '#9ca3af' : '#d1d5db',
                  boxShadow: isTimezoneDropdownOpen ? '0 0 0 1px rgba(156, 163, 175, 0.1)' : 'none'
                }}
              />
              
              <motion.button
                type="button"
                onClick={() => {
                  setIsTimezoneDropdownOpen(!isTimezoneDropdownOpen);
                  if (!isTimezoneDropdownOpen) {
                    setTimezoneSearchTerm('');
                  }
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                animate={{ rotate: isTimezoneDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>
            </div>

            {/* Custom dropdown menu */}
            <AnimatePresence>
              {isTimezoneDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-lg max-h-64 overflow-auto"
                  style={{
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  {filteredTimezones.length > 0 ? filteredTimezones.map((tz, index) => (
                    <motion.button
                      key={tz.value}
                      type="button"
                      onClick={() => handleTimezoneChange(tz.value)}
                      className="w-full px-3 py-2 text-left text-sm transition-all duration-200 flex items-center"
                      style={{
                        fontSize: '13px',
                        fontWeight: 400,
                        color: selectedTimezone === tz.value ? '#ffffff' : '#374151',
                        backgroundColor: selectedTimezone === tz.value ? '#6b7280' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedTimezone !== tz.value) {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedTimezone !== tz.value) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      {selectedTimezone === tz.value && (
                        <motion.svg
                          className="w-3 h-3 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </motion.svg>
                      )}
                      {tz.label}
                    </motion.button>
                  )) : (
                    <div className="px-3 py-4 text-center text-sm" style={{ color: '#6b7280' }}>
                      No timezones found matching "{timezoneSearchTerm}"
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Backdrop to close dropdown */}
            {isTimezoneDropdownOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsTimezoneDropdownOpen(false)}
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Selected Appointment Summary */}
      {selectedDate && selectedTime && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: '#fef7f0',
            borderColor: '#f8981d'
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f8981d' }}></div>
            <div>
              <p className="font-medium" style={{ color: '#000000' }}>
                Time Selected
              </p>
              <p className="text-sm" style={{ color: '#3c4949' }}>
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} at {selectedTime} ({timezones.find(tz => tz.value === selectedTimezone)?.label.split(') ')[1] || selectedTimezone})
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}