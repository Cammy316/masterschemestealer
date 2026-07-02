'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

interface CustomDropdownProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  formatOption?: (val: string) => string;
}

export function CustomDropdown({ value, options, onChange, formatOption = (v) => v }: CustomDropdownProps) {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative z-30">
          <ListboxButton
            className={`flex items-center justify-between min-w-[120px] min-h-[44px] bg-charcoal border text-[10px] rounded px-4 py-2 uppercase tracking-widest outline-none transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass ${open ? 'border-brass text-imperial-gold shadow-[0_0_8px_rgba(184,134,11,0.3)]' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'}`}
          >
            <span className="truncate mr-2">{formatOption(value)}</span>
            <svg 
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className={`flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-imperial-gold' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </ListboxButton>

          <AnimatePresence>
            {open && (
              <ListboxOptions
                static
                as={motion.div}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                // @ts-expect-error Headless UI v2 adds a boolean transition prop which conflicts with framer-motion's transition object
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-1 w-full max-h-48 overflow-y-auto bg-[#0a0a0a] border border-gray-700 rounded shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md scrollbar-hide focus:outline-none"
              >
                {options.map((opt) => (
                  <ListboxOption
                    key={opt}
                    value={opt}
                    className={({ focus, selected }) =>
                      `w-full text-left px-4 py-3 min-h-[44px] text-[10px] uppercase tracking-widest transition-colors cursor-pointer ${
                        selected ? 'bg-brass/20 text-imperial-gold font-bold' : 
                        focus ? 'bg-charcoal text-white' : 'text-gray-400'
                      }`
                    }
                  >
                    {formatOption(opt)}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            )}
          </AnimatePresence>
        </div>
      )}
    </Listbox>
  );
}
