import { Logo } from "@/components/Logo";
import { WalletButton } from "@/components/WalletButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

const TOKEN_ADDRESS = "FwVFweNUdUbfJUKAzreyTYVQoeW6LyqaPcLcn3tzY1ZS";
const HELIUS_API_KEY = "6b52d42b-5d24-4841-a093-02b0d2cc9fc0";

const Index = () => {
  const { publicKey, connected } = useWallet();
  const [hasToken, setHasToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTokenBalance = async () => {
      if (!publicKey || !connected) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 'token-gate-check',
              method: 'getTokenAccountsByOwner',
              params: [
                publicKey.toString(),
                { mint: TOKEN_ADDRESS },
                { encoding: 'jsonParsed' }
              ]
            })
          }
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error.message);
        }

        const accounts = data.result?.value || [];
        const totalBalance = accounts.reduce((acc, account) => {
          return acc + (account.account.data.parsed.info.tokenAmount.uiAmount || 0);
        }, 0);

        setHasToken(totalBalance > 0);
        
        if (totalBalance > 0) {
          toast({
            title: "Access Granted",
            description: "Welcome to the terminal!",
          });
        } else {
          toast({
            title: "Access Denied",
            description: "You need to hold CHESH tokens to access this terminal",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error('Token check failed:', error);
        toast({
          title: "Error",
          description: "Failed to verify token ownership",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (connected) {
      checkTokenBalance();
    } else {
      setIsLoading(false);
    }
  }, [connected, publicKey]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-purple-400">
        <div className="animate-pulse flex items-center gap-2">
          <span>Verifying token ownership</span>
          <span className="animate-[bounce_1s_infinite]">.</span>
          <span className="animate-[bounce_1s_infinite_.2s]">.</span>
          <span className="animate-[bounce_1s_infinite_.4s]">.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
        <Logo />
        
        {!connected && (
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-white">Welcome to CHESH Terminal</h1>
            <p className="text-purple-400 text-lg">Connect your wallet to verify access</p>
            <WalletButton />
          </div>
        )}
        
        {connected && !hasToken && (
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-2xl font-bold text-purple-400">Access Restricted</h2>
            <p className="text-gray-400">
              You need to hold CHESH tokens to access this terminal
            </p>
            <a
              href="https://www.daos.fun/FwVFweNUdUbfJUKAzreyTYVQoeW6LyqaPcLcn3tzY1ZS"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full inline-flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
            >
              <span>Acquire CHESH Tokens</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        )}

        {connected && hasToken && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-purple-400">Access Granted</h2>
            <p className="text-gray-400">Welcome to the CHESH Terminal</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;