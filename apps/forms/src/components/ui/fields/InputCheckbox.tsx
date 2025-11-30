'use client';

import { motion } from 'motion/react';
import { FormField } from '@/types/form';

interface InputCheckboxProps {
  field: FormField;
  value: string[];
  onChange: (name: string, value: string[]) => void;
  error?: string;
}

export function InputCheckbox({ field, value = [], onChange, error }: InputCheckboxProps) {
  const { attributes, settings, options = {} } = field;
  const label = settings.label || settings.admin_field_label || attributes.name;

  const handleChange = (optionValue: string, checked: boolean) => {
    const newValue = checked 
      ? [...value, optionValue]
      : value.filter(v => v !== optionValue);
    if (attributes.name) {
      onChange(attributes.name, newValue);
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <motion.legend
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                ${value.includes(optionValue)
                  ? 'border-orange-400 bg-orange-50' 
                  : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-25'
                }
              `}
              whileHover={{ 
                scale: 1.02,
                y: -1
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id={`${attributes.name}_${optionValue}`}
                  name={attributes.name}
                  value={optionValue}
                  checked={value.includes(optionValue)}
                  onChange={(e) => handleChange(optionValue, e.target.checked)}
                  className="sr-only"
                />
                <motion.div
                  className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center
                    ${value.includes(optionValue)
                      ? 'border-orange-500 bg-orange-500' 
                      : 'border-gray-300 bg-white'
                    }
                  `}
                  animate={{
                    scale: value.includes(optionValue) ? 1.1 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {value.includes(optionValue) && (
                    <motion.svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </motion.svg>
                  )}
                </motion.div>
                <span className={`
                  ml-4 text-sm font-medium
                  ${value.includes(optionValue) ? 'text-orange-900' : 'text-gray-700'}
                `}>
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
