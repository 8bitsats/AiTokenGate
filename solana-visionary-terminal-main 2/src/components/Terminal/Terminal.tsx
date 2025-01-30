import React, { useState, useEffect } from 'react';
import { Buffer } from 'buffer';
import { TerminalInput } from './TerminalInput';
import { TerminalOutput } from './TerminalOutput';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useCommandHandler, CommandOutput } from './CommandHandler';

// Add Buffer to window object
window.Buffer = Buffer;

export const Terminal: React.FC = () => {
  const [output, setOutput] = useState<CommandOutput[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addOutput = (content: string, type: 'success' | 'error' | 'info' | 'json') => {
    setOutput((prev) => [
      ...prev,
      { content, type, timestamp: Date.now() },
    ]);
  };

  const { handleCommand } = useCommandHandler({ addOutput, setIsProcessing });

  useEffect(() => {
    addOutput(
      "🐾 Deep Chesh v3.14 - Solana Terminal Interface\n\nWelcome to DeepSolana Terminal v1.0.0\nType 'help' for available commands.\n\nTrust, but verify with solana verify-checksum",
      'info'
    );
  }, []);

  const onCommand = async (command: string) => {
    const result = await handleCommand(command);
    if (result === 'clear') {
      setOutput([]);
    }
  };

  return (
    <div className="terminal-container min-h-[600px] max-h-[80vh] overflow-y-auto">
      <div className="terminal-header flex justify-between items-center p-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm opacity-50 ml-2">DeepSolana Terminal v3.14</span>
        </div>
        <WalletMultiButton className="bg-blue-600 hover:bg-blue-700" />
      </div>
      
      <TerminalOutput output={output} />
      
      <div className="mt-4">
        <TerminalInput onCommand={onCommand} isProcessing={isProcessing} />
      </div>
    </div>
  );
};