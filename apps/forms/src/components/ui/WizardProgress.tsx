'use client';

import { motion } from 'motion/react';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto px-4 sm:px-0">
      {/* Progress Bar */}
      <div className="relative">
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, #ffbc00 0%, #f8981d 100%)`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ 
              duration: 0.5, 
              ease: [0.25, 0.46, 0.45, 0.94] 
            }}
          />
        </div>
        
        {/* Step Indicators */}
        <div className="flex justify-between mt-4">
          {Array.from({ length: totalSteps }, (_, index) => (
            <motion.div
              key={index}
              className={`
                w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-medium
                transition-all duration-300 relative
                ${index <= currentStep
                  ? 'text-white border-2'
                  : 'bg-gray-100 text-gray-400 border border-gray-200'
                }
              `}
              style={index <= currentStep ? {
                background: `linear-gradient(135deg, #ffbc00 0%, #f8981d 100%)`,
                borderColor: '#ffbc00'
              } : {}}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: index === currentStep ? 1.15 : 1, 
                opacity: 1 
              }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 400,
                damping: 17
              }}
              whileHover={{ scale: 1.1 }}
            >
              {index < currentStep ? (
                <motion.svg
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.2,
                    type: "spring",
                    stiffness: 500,
                    damping: 15
                  }}
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </motion.svg>
              ) : (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {index + 1}
                </motion.span>
              )}
              
              {/* Active Step Glow */}
              {index === currentStep && (
                <motion.div
                  className="absolute inset-0 rounded-full opacity-30"
                  style={{
                    background: `linear-gradient(135deg, #ffbc00 0%, #f8981d 100%)`
                  }}
                  animate={{ 
                    scale: [1, 1.4, 1], 
                    opacity: [0.3, 0, 0.3] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Progress Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mt-6"
      >
        <p className="text-sm" style={{ color: '#3c4949' }}>
          Step <span className="font-semibold" style={{ color: '#f8981d' }}>{currentStep + 1}</span> of {totalSteps}
        </p>
      </motion.div>
    </div>
  );
}
