'use client';

import { motion } from 'motion/react';
import { FormField as FormFieldType } from '@/types/form';
import { InputText } from './fields/InputText';
import { InputEmail } from './fields/InputEmail';
import { InputRadio } from './fields/InputRadio';
import { InputCheckbox } from './fields/InputCheckbox';
import { InputFile } from './fields/InputFile';
import { TextArea } from './fields/TextArea';
import { Select } from './fields/Select';
import { CustomHTML } from './fields/CustomHTML';
import { CalendarBooking } from './fields/CalendarBooking';

interface FormFieldProps {
  field: FormFieldType;
  value: any;
  onChange: (name: string, value: any) => void;
  error?: string;
  index: number;
}

const fieldVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export function FormField({ field, value, onChange, error, index }: FormFieldProps) {
  // Skip hidden fields in UI
  if (field.element === 'input_hidden') {
    return null;
  }

  const renderField = () => {
    switch (field.element) {
      case 'input_text':
        return <InputText field={field} value={value} onChange={onChange} error={error} />;
      case 'input_email':
        return <InputEmail field={field} value={value} onChange={onChange} error={error} />;
      case 'input_radio':
        return <InputRadio field={field} value={value} onChange={onChange} error={error} />;
      case 'input_checkbox':
        return <InputCheckbox field={field} value={value} onChange={onChange} error={error} />;
      case 'input_file':
        return <InputFile field={field} value={value} onChange={onChange} error={error} />;
      case 'textarea':
        return <TextArea field={field} value={value} onChange={onChange} error={error} />;
      case 'select':
        return <Select field={field} value={value} onChange={onChange} error={error} />;
      case 'custom_html':
        return <CustomHTML field={field} />;
      case 'fcal_booking':
        return <CalendarBooking field={field} value={value} onChange={onChange} error={error} />;
      default:
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              Unsupported field type: {field.element}
            </p>
          </div>
        );
    }
  };

  return (
    <motion.div
      variants={fieldVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      className="mb-6"
    >
      {renderField()}
    </motion.div>
  );
}
