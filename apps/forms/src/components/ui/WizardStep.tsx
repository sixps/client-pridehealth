'use client';

import { motion } from 'motion/react';
import { FormField as FormFieldType } from '@/types/form';
import { FormField } from './FormField';

interface WizardStepProps {
  fields: FormFieldType[];
  formData: Record<string, any>;
  errors: Record<string, string>;
  onFieldChange: (name: string, value: any) => void;
  stepNumber: number;
  totalSteps: number;
}

const stepVariants = {
  enter: {
    x: 50,
    opacity: 0,
    scale: 0.98,
  },
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    x: -50,
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const fieldContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export function WizardStep({ 
  fields, 
  formData, 
  errors, 
  onFieldChange, 
  stepNumber, 
  totalSteps 
}: WizardStepProps) {
  // Check if there are any errors for the current step fields
  const hasErrors = fields.some(field => errors[field.attributes.name]);
  
  // Check if any field has a value (to determine if we should show help text)
  const hasValues = fields.some(field => {
    const value = formData[field.attributes.name];
    return value && value !== '';
  });

  // Show help text if: no values entered yet, OR there are errors, OR it's the final step
  const shouldShowHelpText = !hasValues || hasErrors || stepNumber === totalSteps;

  return (
    <motion.div
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="min-h-[400px]"
    >
      {/* Step Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="mb-10"
      >
        <motion.div 
          className="flex items-center justify-between mb-6"
          layout
        >
          <motion.h2 
            className="font-bold"
            style={{ 
              fontSize: '18px', 
              fontWeight: 700, 
              color: '#000000' 
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            Step {stepNumber} of {totalSteps}
          </motion.h2>
          <motion.div 
            className="text-sm bg-gray-50 px-3 py-1 rounded-full"
            style={{ color: '#858b8b' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Question {stepNumber}
          </motion.div>
        </motion.div>
        
        {/* Step Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="leading-relaxed"
          style={{ 
            fontSize: '17px', 
            fontWeight: 400, 
            color: '#3c4949' 
          }}
        >
          Please provide the following information to help us better understand your health needs.
        </motion.p>
      </motion.div>

      {/* Fields */}
      <motion.div
        variants={fieldContainerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {fields.map((field, index) => (
          <FormField
            key={field.uniqElKey}
            field={field}
            value={formData[field.attributes.name]}
            onChange={onFieldChange}
            error={errors[field.attributes.name]}
            index={index}
          />
        ))}
      </motion.div>

      {/* Step Footer Info */}
      {fields.length > 0 && shouldShowHelpText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ delay: 0.8 }}
          className="mt-10 p-4 rounded-xl border"
          style={{
            backgroundColor: '#fffef7',
            borderColor: '#ffbc00'
          }}
        >
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#f8981d' }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <p className="text-sm" style={{ color: '#f8981d' }}>
              {stepNumber === totalSteps 
                ? "Review your information and submit when ready."
                : "All fields are optional unless marked as required."
              }
            </p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
