'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { FormField } from '@/types/form';
import { formatPhoneNumber } from '@/utils/validation';

type CountryOption = {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
};

const COUNTRY_OPTIONS: CountryOption[] = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
];

interface InputTextProps {
  field: FormField;
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
}

export function InputText({ field, value, onChange, error }: InputTextProps) {
  const { attributes, settings } = field;
  const label = settings.label || settings.admin_field_label || attributes.name;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isPhoneField =
    attributes.name?.toLowerCase().includes('phone') ||
    attributes.placeholder?.toLowerCase().includes('phone');

  const currentCountry = useMemo<CountryOption>(() => {
    if (!value) {
      return COUNTRY_OPTIONS[0];
    }
    const match = COUNTRY_OPTIONS.find((country) => value.startsWith(country.dialCode));
    return match ?? COUNTRY_OPTIONS[0];
  }, [value]);

  const localDigits = useMemo(() => {
    if (!value) return '';
    if (value.startsWith(currentCountry.dialCode)) {
      return value.slice(currentCountry.dialCode.length);
    }
    return value;
  }, [value, currentCountry.dialCode]);

  const formattedLocalValue = useMemo(() => {
    const digitsOnly = localDigits.replace(/\D/g, '');
    if (!digitsOnly) {
      return '';
    }
    return formatPhoneNumber(digitsOnly);
  }, [localDigits]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleGenericChange = (newValue: string) => {
    if (attributes.name) {
      onChange(attributes.name, newValue);
    }
  };

  const handlePhoneInputChange = (inputValue: string) => {
    const sanitized = inputValue.replace(/[^\d]/g, '');
    if (attributes.name) {
      const combinedValue = `${currentCountry.dialCode}${sanitized}`;
      onChange(attributes.name, combinedValue);
    }
  };

  const handleCountrySelect = (country: CountryOption) => {
    if (attributes.name) {
      const sanitized = localDigits.replace(/[^\d]/g, '');
      const combinedValue = `${country.dialCode}${sanitized}`;
      onChange(attributes.name, combinedValue);
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && (
        <motion.label
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          htmlFor={attributes.id || attributes.name}
          className="block font-medium mb-2"
          style={{ 
            fontSize: '17px', 
            fontWeight: 500, 
            color: '#000000' 
          }}
        >
          {label}
          {attributes.required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}
      
      {isPhoneField ? (
        <div className="space-y-2">
          <div className="flex flex-col gap-3 sm:flex-row" ref={dropdownRef}>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition hover:border-gray-300"
              >
                <span className="text-lg" role="img" aria-label={currentCountry.name}>
                  {currentCountry.flag}
                </span>
                <span className="font-medium text-gray-900">{currentCountry.dialCode}</span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute z-30 mt-2 w-64 max-h-64 overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-lg">
                  {COUNTRY_OPTIONS.map((country) => (
                    <button
                      type="button"
                      key={country.code}
                      className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                        country.code === currentCountry.code ? 'bg-gray-50' : ''
                      }`}
                      onClick={() => handleCountrySelect(country)}
                    >
                      <span className="text-lg" role="img" aria-label={country.name}>
                        {country.flag}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{country.name}</span>
                        <span className="text-xs text-gray-500">{country.dialCode}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <motion.input
              whileFocus={{
                scale: 1.01,
                y: -1,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              type="tel"
              inputMode="tel"
              id={attributes.id || attributes.name}
              name={attributes.name}
              value={formattedLocalValue}
              placeholder={attributes.placeholder || 'Enter phone number'}
              required={attributes.required}
              onChange={(e) => handlePhoneInputChange(e.target.value)}
              className={`
                w-full px-4 py-4 border border-gray-200 bg-white transition-all duration-300 ease-out flex-1
                ${error ? 'border-red-400' : ''}
                ${attributes.class || ''}
              `}
              style={{
                borderRadius: '12px',
                fontSize: '17px',
                color: '#000000',
                borderColor: error ? '#ef4444' : '#e5e7eb',
              }}
            />
          </div>
          <p className="text-xs text-gray-500">
            International format required. Stored as {currentCountry.dialCode}
            {formattedLocalValue.replace(/[^\d]/g, '')}.
          </p>
        </div>
      ) : (
        <motion.input
          whileFocus={{
            scale: 1.01,
            y: -1,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          type="text"
          id={attributes.id || attributes.name}
          name={attributes.name}
          value={value || ''}
          placeholder={attributes.placeholder}
          required={attributes.required}
          onChange={(e) => handleGenericChange(e.target.value)}
          className={`
            w-full px-4 py-4 border border-gray-200 bg-white transition-all duration-300 ease-out
            ${error ? 'border-red-400' : ''}
            ${attributes.class || ''}
          `}
          style={{
            borderRadius: '12px',
            fontSize: '17px',
            color: '#000000',
            borderColor: error ? '#ef4444' : '#e5e7eb',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#f8981d';
            e.target.style.boxShadow = '0 0 0 3px rgba(248, 152, 29, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? '#ef4444' : '#e5e7eb';
            e.target.style.boxShadow = 'none';
          }}
        />
      )}
      
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
