"use client";

import { useRef, useEffect } from 'react';

export const OtpInput = ({ length = 6, otp = "", setOtp }: { length?: number; otp?: string; setOtp: (otp: string) => void; }) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    if (value && !/^[0-9]$/.test(value)) {
      e.target.value = '';
      return;
    }

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    const newOtp = inputsRef.current.map(input => input?.value || '').join('');
    setOtp(newOtp);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const newOtp = inputsRef.current.map(input => input?.value || '').join('');
      setOtp(newOtp);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').slice(0, length);
    
    pasteData.split('').forEach((char, i) => {
      if (inputsRef.current[i] && /^[0-9]$/.test(char)) {
        inputsRef.current[i]!.value = char;
        if (i < length - 1) {
          inputsRef.current[i + 1]?.focus();
        }
      }
    });
    const newOtp = inputsRef.current.map(input => input?.value || '').join('');
    setOtp(newOtp);
  };

  return (
    <div className="flex justify-center gap-3 mb-6">
      {[...Array(length)].map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          className="h-14 w-14 rounded-lg border border-gray-300 text-center text-2xl font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
          autoFocus={i === 0}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};