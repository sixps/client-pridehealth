// Validation utilities for form fields

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: true }; // Empty is valid if not required
  }

  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Check for common phone number patterns
  if (digitsOnly.length < 10) {
    return {
      isValid: false,
      error: 'Phone number must be at least 10 digits'
    };
  }
  
  if (digitsOnly.length > 15) {
    return {
      isValid: false,
      error: 'Phone number is too long'
    };
  }

  // US phone number pattern (10-11 digits)
  const usPhonePattern = /^(\+?1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/;
  // International pattern (more flexible)
  const intlPhonePattern = /^\+?[\d\s\-\(\)]{10,15}$/;
  
  if (!usPhonePattern.test(digitsOnly) && !intlPhonePattern.test(phone)) {
    return {
      isValid: false,
      error: 'Please enter a valid phone number'
    };
  }

  return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: true }; // Empty is valid if not required
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailPattern.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  return { isValid: true };
};

export const validateRequired = (value: any, fieldName: string): ValidationResult => {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }
  
  return { isValid: true };
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }
  
  // Format as +1 (XXX) XXX-XXXX for US numbers with country code
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  }
  
  // Return as-is for international numbers
  return phone;
};
