import React, { useState, useRef, useEffect } from 'react';
import { useTypewriter } from 'react-simple-typewriter';

interface TerminalInputProps {
  onCommand: (command: string) => void;
  isProcessing: boolean;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({ onCommand, isProcessing }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [prompt] = useTypewriter({
    words: ['$'],
    loop: true,
    delaySpeed: 2000,
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onCommand(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <span className="terminal-prompt">{prompt}</span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="terminal-input"
        disabled={isProcessing}
        placeholder={isProcessing ? 'Processing...' : 'Type a command...'}
        autoFocus
      />
    </form>
  );
};