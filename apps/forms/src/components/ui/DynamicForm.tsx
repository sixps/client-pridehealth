'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FluentForm, FormState, FormSubmissionData } from '@/types/form';
import { FormField } from './FormField';

interface DynamicFormProps {
  form: FluentForm;
  onSubmit: (data: FormSubmissionData) => Promise<void>;
}

export function DynamicForm({ form, onSubmit }: DynamicFormProps) {
  const [formState, setFormState] = useState<FormState>({
    data: {},
    errors: {},
    isSubmitting: false,
  });

  const handleFieldChange = (name: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      data: { ...prev.data, [name]: value },
      errors: { ...prev.errors, [name]: '' }, // Clear error when user types
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    form.form_fields.fields.forEach(field => {
      if (field.attributes.required && field.element !== 'input_hidden' && field.attributes.name) {
        const value = formState.data[field.attributes.name];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          errors[field.attributes.name] = `${field.settings.label || field.attributes.name} is required`;
        }
      }
    });

    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setFormState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      // Add hidden field values
      const hiddenFields = form.form_fields.fields
        .filter(field => field.element === 'input_hidden' && field.attributes.name)
        .reduce((acc, field) => {
          if (field.attributes.name) {
            acc[field.attributes.name] = field.attributes.value || '';
          }
          return acc;
        }, {} as FormSubmissionData);

      await onSubmit({ ...hiddenFields, ...formState.data });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const visibleFields = form.form_fields.fields.filter(
    field => field.element !== 'input_hidden'
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {form.title}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
      >
        <AnimatePresence>
          {visibleFields.map((field, index) => (
            <FormField
              key={field.uniqElKey}
              field={field}
              value={field.attributes.name ? formState.data[field.attributes.name] : undefined}
              onChange={handleFieldChange}
              error={field.attributes.name ? formState.errors[field.attributes.name] : undefined}
              index={index}
            />
          ))}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={formState.isSubmitting}
            className={`
              px-8 py-3 rounded-lg font-medium text-white
              bg-gradient-to-r from-blue-600 to-purple-600
              hover:from-blue-700 hover:to-purple-700
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 ease-in-out
              shadow-lg hover:shadow-xl
            `}
          >
            {formState.isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block mr-2"
              />
            ) : null}
            {formState.isSubmitting ? 'Submitting...' : 'Submit Form'}
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
