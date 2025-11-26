'use client';

import { motion } from 'motion/react';
import { FormField } from '@/types/form';

interface InputRadioProps {
  field: FormField;
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
}

export function InputRadio({ field, value, onChange, error }: InputRadioProps) {
  const { attributes, settings, options = {} } = field;
  const label = settings.label || settings.admin_field_label || attributes.name;

  return (
    <div className="space-y-3">
      {label && (
        <motion.legend
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="block text-sm font-medium text-gray-800 mb-3"
        >
          {label}
          {attributes.required && <span className="text-red-500 ml-1">*</span>}
        </motion.legend>
      )}
      
      <div className="space-y-3">
        {Object.entries(options).map(([optionValue, optionLabel], index) => (
          <motion.div
            key={optionValue}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + (index * 0.1) }}
            className="relative"
          >
            <motion.label
              htmlFor={`${attributes.name}_${optionValue}`}
              className={`
                flex items-center p-4 border-2 cursor-pointer transition-all duration-300
                ${value === optionValue 
                  ? 'bg-white' 
                  : 'border-gray-200 bg-white'
                }
              `}
              style={{
                borderRadius: '12px',
                borderColor: value === optionValue ? '#f8981d' : '#e5e7eb',
                backgroundColor: value === optionValue ? '#fffbf7' : '#ffffff'
              }}
              onMouseEnter={(e) => {
                if (value !== optionValue) {
                  e.currentTarget.style.borderColor = '#ffbc00';
                  e.currentTarget.style.backgroundColor = '#fffef7';
                }
              }}
              onMouseLeave={(e) => {
                if (value !== optionValue) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }
              }}
              whileHover={{ 
                scale: 1.02,
                y: -1
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="relative flex items-center">
                <input
                  type="radio"
                  id={`${attributes.name}_${optionValue}`}
                  name={attributes.name}
                  value={optionValue}
                  checked={value === optionValue}
                  onChange={(e) => onChange(attributes.name, e.target.value)}
                  className="sr-only"
                />
                <motion.div
                  className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                  `}
                  style={{
                    borderColor: value === optionValue ? '#f8981d' : '#d1d5db',
                    backgroundColor: value === optionValue ? '#f8981d' : '#ffffff'
                  }}
                  animate={{
                    scale: value === optionValue ? 1.1 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {value === optionValue && (
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    />
                  )}
                </motion.div>
                <span 
                  className="ml-4 font-medium"
                  style={{
                    fontSize: '17px',
                    fontWeight: 400,
                    color: value === optionValue ? '#000000' : '#3c4949'
                  }}
                >
                  {optionLabel}
                </span>
              </div>
            </motion.label>
          </motion.div>
        ))}
      </div>
      
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
