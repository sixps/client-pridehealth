'use client';

import { motion } from 'motion/react';
import { FormField } from '@/types/form';

interface TextAreaProps {
  field: FormField;
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
}

export function TextArea({ field, value, onChange, error }: TextAreaProps) {
  const { attributes, settings } = field;
  const label = settings.label || settings.admin_field_label || attributes.name;

  return (
    <div className="space-y-2">
      {label && (
        <motion.label
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          htmlFor={attributes.id || attributes.name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {attributes.required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}
      
      <motion.textarea
        whileFocus={{ 
          scale: 1.01,
          y: -1
        }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        id={attributes.id || attributes.name}
        name={attributes.name}
        value={value || ''}
        placeholder={attributes.placeholder}
        required={attributes.required}
        rows={4}
        onChange={(e) => attributes.name && onChange(attributes.name, e.target.value)}
        className={`
          w-full px-4 py-4 border border-gray-200 rounded-xl
          focus:ring-2 focus:ring-orange-400 focus:border-orange-400
          bg-white transition-all duration-300 ease-out
          placeholder-gray-400 text-gray-900 resize-vertical
          ${error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}
          ${attributes.class || ''}
        `}
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
