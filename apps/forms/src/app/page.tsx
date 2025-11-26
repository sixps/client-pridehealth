'use client';

import { motion } from 'motion/react';
import Image from "next/image";
import { FormWizard } from '@/components/ui/FormWizard';
import { sampleForm } from '@/data/sample-form';
import { FormSubmissionData } from '@/types/form';

export default function Home() {
  const handleFormSubmit = async (data: FormSubmissionData) => {
    // Simulate form submission
    console.log('Form submitted:', data);
    
    // In a real app, this would send data to your backend
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Form submitted successfully! Check the console for submitted data.');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-white border-b border-gray-100 sticky top-0 z-50"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <motion.img
                src="/pride-health-logo.jpeg"
                alt="Pride Health"
                className="h-12 w-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-full"
            >
              <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secure</span>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <FormWizard form={sampleForm} onSubmit={handleFormSubmit} />
        </div>
      </main>
    </div>
  );
}
