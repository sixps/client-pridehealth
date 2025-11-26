'use client';

import { motion } from 'motion/react';

interface WizardNavigationProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function WizardNavigation({
  isFirstStep,
  isLastStep,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit
}: WizardNavigationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="bg-gray-50 px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-100"
    >
      <div className="flex justify-between items-center">
        {/* Previous Button */}
        <motion.button
          whileHover={!isFirstStep ? { 
            scale: 1.02,
            x: -2
          } : {}}
          whileTap={!isFirstStep ? { scale: 0.98 } : {}}
          type="button"
          onClick={onPrevious}
          disabled={isFirstStep}
          className={`
            px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base
            ${isFirstStep
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }
          `}
        >
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <motion.svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              whileHover={!isFirstStep ? { x: -2 } : {}}
              transition={{ type: "spring", stiffness: 600, damping: 20 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </motion.svg>
            <span>Previous</span>
          </motion.div>
        </motion.button>

        {/* Empty space - removed tab navigation text */}
        <div></div>

        {/* Next/Submit Button */}
        {isLastStep ? (
          <motion.button
            whileHover={{ 
              scale: 1.02,
              x: 2
            }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className={`
              px-6 sm:px-8 py-3 font-medium text-white text-sm sm:text-base
              transition-all duration-200 ease-out
              focus:outline-none focus:ring-2 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            style={{
              backgroundColor: '#f25322',
              borderRadius: '50px',
              boxShadow: '0 2px 8px rgba(242, 83, 34, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = '#d63d1a';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(242, 83, 34, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = '#f25322';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(242, 83, 34, 0.3)';
              }
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <motion.div 
              className="flex items-center space-x-2"
              layout
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Form</span>
                  <motion.svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 600, damping: 20 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </motion.svg>
                </>
              )}
            </motion.div>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ 
              scale: 1.02,
              x: 2
            }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onNext}
            className={`
              px-6 sm:px-8 py-3 font-medium text-white text-sm sm:text-base
              transition-all duration-200 ease-out
              focus:outline-none focus:ring-2 focus:ring-offset-2
            `}
            style={{
              backgroundColor: '#ffbc00',
              borderRadius: '50px',
              boxShadow: '0 2px 8px rgba(255, 188, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8981d';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(248, 152, 29, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffbc00';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 188, 0, 0.3)';
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <motion.div 
              className="flex items-center space-x-2"
              layout
            >
              <span>Next</span>
              <motion.svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 600, damping: 20 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            </motion.div>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}