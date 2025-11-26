'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FormField } from '@/types/form';

interface SelectProps {
  field: FormField;
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
}

export function Select({ field, value, onChange, error }: SelectProps) {
  const { attributes, settings, options = {} } = field;
  const label = settings.label || settings.admin_field_label || attributes.name;
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = value ? options[value] : null;
  const optionEntries = Object.entries(options);

  const handleSelect = (optionValue: string) => {
    onChange(attributes.name, optionValue);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
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
      
      <div className="relative">
        <motion.button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          whileFocus={{ 
            scale: 1.01,
            y: -1
          }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`
            w-full px-4 py-4 pr-10 border bg-white transition-all duration-300 ease-out
            text-left cursor-pointer
            ${error ? 'border-red-400' : 'border-gray-200'}
            ${attributes.class || ''}
          `}
          style={{
            borderRadius: '12px',
            fontSize: '17px',
            color: selectedOption ? '#000000' : '#9ca3af',
            borderColor: error ? '#ef4444' : (isOpen ? '#f8981d' : '#e5e7eb'),
            boxShadow: isOpen ? '0 0 0 3px rgba(248, 152, 29, 0.1)' : 'none'
          }}
        >
          {selectedOption || 'Please select...'}
          
          {/* Custom dropdown arrow */}
          <motion.div 
            className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.button>

        {/* Custom dropdown menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-lg max-h-60 overflow-auto"
              style={{
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
              }}
            >
              {optionEntries.map(([optionValue, optionLabel], index) => (
                <motion.button
                  key={optionValue}
                  type="button"
                  onClick={() => handleSelect(optionValue)}
                  className={`
                    w-full px-4 py-3 text-left transition-all duration-200
                    ${value === optionValue 
                      ? 'text-white' 
                      : 'text-gray-900 hover:text-white'
                    }
                  `}
                  style={{
                    fontSize: '17px',
                    fontWeight: 400,
                    backgroundColor: value === optionValue ? '#f8981d' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (value !== optionValue) {
                      e.currentTarget.style.backgroundColor = '#fffbf7';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (value !== optionValue) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center">
                    {value === optionValue && (
                      <motion.svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </motion.svg>
                    )}
                    {optionLabel}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backdrop to close dropdown */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
      
      {settings.help_message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm"
          style={{ color: '#858b8b' }}
        >
          {settings.help_message}
        </motion.p>
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