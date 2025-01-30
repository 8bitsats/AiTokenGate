import React, { useState } from 'react';

import { User } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { UsernameValidationError } from '@/types/registration';

interface UsernameInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidation?: (isValid: boolean) => void;
}

export const UsernameInput = ({ value, onChange, onValidation }: UsernameInputProps) => {
  const [error, setError] = useState<UsernameValidationError | null>(null);

  const validateUsername = (username: string) => {
    if (!username) {
      setError({ type: 'required', message: 'Username is required' });
      onValidation?.(false);
      return;
    }

    if (username.length < 3) {
      setError({ type: 'minLength', message: 'Username must be at least 3 characters' });
      onValidation?.(false);
      return;
    }

    if (username.length > 20) {
      setError({ type: 'maxLength', message: 'Username must be less than 20 characters' });
      onValidation?.(false);
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError({ type: 'pattern', message: 'Username can only contain letters, numbers, and underscores' });
      onValidation?.(false);
      return;
    }

    setError(null);
    onValidation?.(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    validateUsername(e.target.value);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <User className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          name="username"
          value={value}
          onChange={handleChange}
          placeholder="Choose a username"
          className={`pl-10 ${error ? 'border-red-500' : ''}`}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};
