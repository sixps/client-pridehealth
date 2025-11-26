'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FluentForm, FormState, FormSubmissionData, FormField } from '@/types/form';
import { WizardStep } from './WizardStep';
import { WizardProgress } from './WizardProgress';
import { WizardNavigation } from './WizardNavigation';
import { validatePhoneNumber, validateEmail, validateRequired } from '@/utils/validation';

interface FormWizardProps {
  form: FluentForm;
  onSubmit: (data: FormSubmissionData) => Promise<void>;
}

export function FormWizard({ form, onSubmit }: FormWizardProps) {
  const [formState, setFormState] = useState<FormState>({
    data: {},
    errors: {},
    isSubmitting: false,
    currentStep: 0,
    totalSteps: 0,
  });
  
  const isNavigatingFromBrowser = useRef(false);

  // Group fields into logical steps - one question per step
  const createSteps = (fields: FormField[]) => {
    const visibleFields = fields.filter(field => field.element !== 'input_hidden');
    const steps: FormField[][] = [];
    
    // Each question gets its own step for better UX
    visibleFields.forEach(field => {
      steps.push([field]);
    });
    
    return steps;
  };

  const steps = createSteps(form.form_fields.fields);
  const currentStep = formState.currentStep || 0;
  const totalSteps = steps.length;

  // Update total steps in state if not set
  if (formState.totalSteps !== totalSteps) {
    setFormState(prev => ({ ...prev, totalSteps }));
  }

  // Initialize browser history and handle back/forward navigation
  useEffect(() => {
    // Initialize history state on mount
    if (typeof window !== 'undefined') {
      const currentState = window.history.state;
      if (!currentState || currentState.step !== currentStep) {
        window.history.replaceState({ step: currentStep }, '', window.location.href);
      }
    }
  }, []); // Only run on mount

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && typeof event.state.step === 'number') {
        const targetStep = event.state.step;
        if (targetStep >= 0 && targetStep < totalSteps) {
          isNavigatingFromBrowser.current = true;
          setFormState(prev => ({ ...prev, currentStep: targetStep }));
          // Reset flag after state update
          setTimeout(() => {
            isNavigatingFromBrowser.current = false;
          }, 0);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [totalSteps]);

  const validateField = (field: FormField, value: any): string => {
    const { attributes, element } = field;
    
    // Check required validation
    if (attributes.required && attributes.name) {
      const requiredResult = validateRequired(value, attributes.name);
      if (!requiredResult.isValid) {
        return requiredResult.error || '';
      }
    }
    
    // Skip validation if field is empty and not required
    if (!value) return '';
    
    // Type-specific validation
    switch (element) {
      case 'input_email':
        const emailResult = validateEmail(value);
        return emailResult.isValid ? '' : (emailResult.error || '');
        
      case 'input_text':
        // Check if it's a phone field based on name or placeholder
        const fieldName = attributes.name?.toLowerCase() || '';
        const placeholder = attributes.placeholder?.toLowerCase() || '';
        if (fieldName.includes('phone') || placeholder.includes('phone')) {
          const phoneResult = validatePhoneNumber(value);
          return phoneResult.isValid ? '' : (phoneResult.error || '');
        }
        return '';
      
      default:
        return '';
    }
    
    return '';
  };

  const handleFieldChange = (name: string, value: any) => {
    // Find the field to validate
    const allFields = form.form_fields.fields;
    const field = allFields.find(f => f.attributes.name === name);
    
    // Validate the field
    const error: string = field ? validateField(field, value) : '';
    
    setFormState(prev => ({
      ...prev,
      data: { ...prev.data, [name]: value },
      errors: { ...prev.errors, [name]: error },
    }));
  };

  const validateCurrentStep = (): boolean => {
    const currentFields = steps[currentStep];
    const errors: Record<string, string> = {};
    
    currentFields.forEach(field => {
      if (field.attributes.required && field.attributes.name) {
        const value = formState.data[field.attributes.name];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          errors[field.attributes.name] = `${field.settings.label || field.attributes.name} is required`;
        }
      }
    });

    setFormState(prev => ({ ...prev, errors: { ...prev.errors, ...errors } }));
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      // Push to browser history
      if (typeof window !== 'undefined' && !isNavigatingFromBrowser.current) {
        window.history.pushState({ step: nextStep }, '', window.location.href);
      }
      setFormState(prev => ({ ...prev, currentStep: nextStep }));
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      // Push to browser history
      if (typeof window !== 'undefined' && !isNavigatingFromBrowser.current) {
        window.history.pushState({ step: prevStep }, '', window.location.href);
      }
      setFormState(prev => ({ ...prev, currentStep: prevStep }));
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

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

  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1 
      }}
      className="max-w-3xl mx-auto px-4 sm:px-0"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-8 text-center"
      >
        <motion.h1 
          className="text-2xl font-semibold text-gray-900 mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {form.title}
        </motion.h1>
        
        {/* Progress Indicator */}
        <WizardProgress 
          currentStep={currentStep} 
          totalSteps={totalSteps}
        />
      </motion.div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-white border border-gray-100 rounded-2xl overflow-hidden"
        style={{
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Step Content */}
        <div className="p-6 sm:p-8 lg:p-12">
          <AnimatePresence mode="wait">
            <WizardStep
              key={currentStep}
              fields={steps[currentStep] || []}
              formData={formState.data}
              errors={formState.errors}
              onFieldChange={handleFieldChange}
              stepNumber={currentStep + 1}
              totalSteps={totalSteps}
            />
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <WizardNavigation
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          isSubmitting={formState.isSubmitting}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      </motion.div>
    </motion.div>
  );
}
