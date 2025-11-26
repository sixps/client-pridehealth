'use client';

import { motion } from 'motion/react';
import { FormField } from '@/types/form';
import { formatPhoneNumber } from '@/utils/validation';

interface InputTextProps {
  field: FormField;
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
}

export function InputText({ field, value, onChange, error }: InputTextProps) {
  const { attributes, settings } = field;
  const label = settings.label || settings.admin_field_label || attributes.name;
  
  // Check if this is a phone field
  const isPhoneField = attributes.name?.toLowerCase().includes('phone') || 
                      attributes.placeholder?.toLowerCase().includes('phone');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Format phone numbers as user types
    if (isPhoneField) {
      newValue = formatPhoneNumber(newValue);
    }
    
    onChange(attributes.name, newValue);
  };

  return (
    <div className="space-y-2">
      {label && (
        <motion.label
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          htmlFor={attributes.id || attributes.name}
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
      
      <motion.input
        whileFocus={{ 
          scale: 1.01,
          y: -1
        }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        type="text"
        id={attributes.id || attributes.name}
        name={attributes.name}
        value={value || ''}
        placeholder={attributes.placeholder}
        required={attributes.required}
        onChange={(e) => onChange(attributes.name, e.target.value)}
        className={`
          w-full px-4 py-4 border border-gray-200 bg-white transition-all duration-300 ease-out
          ${error ? 'border-red-400' : ''}
          ${attributes.class || ''}
        `}
        style={{
          borderRadius: '12px',
          fontSize: '17px',
          color: '#000000',
          borderColor: error ? '#ef4444' : '#e5e7eb'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#f8981d';
          e.target.style.boxShadow = '0 0 0 3px rgba(248, 152, 29, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#ef4444' : '#e5e7eb';
          e.target.style.boxShadow = 'none';
        }}
      />
      
      {settings.help_message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          {settings.help_message}
        </motion.p>
      )}
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
