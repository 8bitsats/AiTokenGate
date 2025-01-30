import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { fetchWalletPortfolio, fetchTokenBalance } from '@/utils/birdeyeApi';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { supabase } from "@/integrations/supabase/client";
import { BirdeyeWebSocket } from '@/utils/birdeyeWebSocket';
import { useRef } from 'react';

export interface CommandOutput {
  content: string;
  type: 'success' | 'error' | 'info' | 'json';
  timestamp: number;
}

interface CommandHandlerProps {
  addOutput: (content: string, type: 'success' | 'error' | 'info' | 'json') => void;
  setIsProcessing: (isProcessing: boolean) => void;
}

export const useCommandHandler = ({ addOutput, setIsProcessing }: CommandHandlerProps) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const wsRef = useRef<BirdeyeWebSocket | null>(null);

  const formatUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const handleCommand = async (command: string) => {
    setIsProcessing(true);
    addOutput(`> ${command}`, 'info');

    const args = command.split(' ');
    const cmd = args[0].toLowerCase();

    try {
      switch (cmd) {
        case 'help':
          addOutput(`
🐾 DeepSolana Terminal Commands:
  help              - Show available commands
  clear             - Clear terminal interface
  connect           - Initialize wallet connection
  balance           - Query SOL balance
  portfolio         - View complete token portfolio
  token <address>   - Check specific token balance
  track <address>   - Track token price in real-time
  art <prompt>      - Generate AI art with DALL-E
  ask <prompt>      - Chat with Groq AI
  deep <prompt>     - Engage DeepSolana reasoning
  gpt <prompt>      - Access GPT-4 analysis
  setkey <key>      - Configure API credentials

Trust, but verify with solana verify-checksum 🛡️`, 'info');
          break;

        case 'track':
          if (!args[1]) {
            addOutput('🐾 Please provide a token address to track', 'error');
            break;
          }
          
          // Disconnect existing WebSocket if any
          if (wsRef.current) {
            wsRef.current.disconnect();
          }

          // Create new WebSocket connection
          wsRef.current = new BirdeyeWebSocket((priceData) => {
            if (priceData && priceData.data) {
              addOutput(`🐾 Price Update for ${args[1]}:
Price: ${formatUSD(priceData.data.price || 0)}
Time: ${new Date().toLocaleTimeString()}`, 'info');
            }
          });

          wsRef.current.connect(args[1]);
          addOutput(`🐾 Started tracking price for token: ${args[1]}`, 'success');
          break;

        case 'art':
          if (args.length < 2) {
            addOutput('🐾 Please provide a prompt for art generation', 'error');
            break;
          }
          try {
            const artPrompt = args.slice(1).join(' ');
            const { data, error } = await supabase.functions.invoke('ai-operations', {
              body: { operation: 'generate-image', prompt: artPrompt }
            });
            
            if (error) throw error;
            if (data.error) throw new Error(data.error.message);
            
            addOutput(`🐾 Generated Art URL: ${data.data[0].url}`, 'success');
          } catch (error) {
            addOutput(`🐾 Art generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
          }
          break;

        case 'ask':
          if (args.length < 2) {
            addOutput('🐾 Please provide a prompt for the AI', 'error');
            break;
          }
          try {
            const chatPrompt = args.slice(1).join(' ');
            const { data, error } = await supabase.functions.invoke('ai-operations', {
              body: { operation: 'chat', prompt: chatPrompt }
            });
            
            if (error) throw error;
            if (data.error) throw new Error(data.error.message);
            
            addOutput(`🐾 AI Response: ${data.choices[0].message.content}`, 'success');
          } catch (error) {
            addOutput(`🐾 AI chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
          }
          break;

        case 'portfolio':
          if (!wallet.publicKey) {
            addOutput('🐾 Please connect your wallet first using the connect command', 'error');
            break;
          }
          try {
            const portfolio = await fetchWalletPortfolio(wallet.publicKey.toString());
            addOutput(`🐾 Portfolio Overview for ${wallet.publicKey.toString()}:
Total Value: ${formatUSD(portfolio.totalUsd)}

Token Balances:
${portfolio.items.map(token => `
${token.name || 'Unknown Token'} (${token.symbol || token.address})
Balance: ${token.uiAmount.toLocaleString()} ${token.symbol || ''}
Value: ${token.valueUsd ? formatUSD(token.valueUsd) : 'N/A'}
`).join('\n')}`, 'success');
          } catch (error) {
            addOutput(`🐾 Failed to fetch portfolio: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
          }
          break;

        case 'token':
          if (!wallet.publicKey) {
            addOutput('🐾 Please connect your wallet first using the connect command', 'error');
            break;
          }
          if (!args[1]) {
            addOutput('🐾 Please provide a token address', 'error');
            break;
          }
          try {
            const tokenBalance = await fetchTokenBalance(wallet.publicKey.toString(), args[1]);
            addOutput(`🐾 Token Balance:
Address: ${tokenBalance.address}
Balance: ${tokenBalance.uiAmount.toLocaleString()}
Value: ${tokenBalance.valueUsd ? formatUSD(tokenBalance.valueUsd) : 'N/A'}
Price: ${tokenBalance.priceUsd ? formatUSD(tokenBalance.priceUsd) : 'N/A'}`, 'success');
          } catch (error) {
            addOutput(`🐾 Failed to fetch token balance: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
          }
          break;

        case 'clear':
          return 'clear';

        case 'connect':
          try {
            if (!wallet.connected) {
              if (!wallet.wallet) {
                addOutput('🐾 Please select a wallet for secure interaction', 'error');
                break;
              }
              await wallet.connect();
              addOutput('🐾 Wallet connection established successfully', 'success');
            } else {
              addOutput('🐾 Wallet already connected and verified', 'info');
            }
          } catch (error) {
            if (error instanceof WalletNotConnectedError) {
              addOutput('🐾 Please select a wallet using the interface controls', 'error');
            } else {
              addOutput(`🐾 Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
            }
          }
          break;

        case 'balance':
          if (!wallet.publicKey) {
            addOutput('🐾 Please connect your wallet first for balance verification', 'error');
            break;
          }
          try {
            const balance = await connection.getBalance(wallet.publicKey);
            addOutput(`🐾 Verified Balance: ${balance / LAMPORTS_PER_SOL} SOL`, 'success');
          } catch (error) {
            addOutput(`🐾 Balance fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
          }
          break;

        default:
          addOutput(`🐾 Unknown command: ${cmd}. Type 'help' for available operations.`, 'error');
      }
    } catch (error) {
      addOutput(`🐾 Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }

    setIsProcessing(false);
    return null;
  };

  return { handleCommand };
};
