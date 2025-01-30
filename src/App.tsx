// Import wallet adapter styles using ES6 import
import '@solana/wallet-adapter-react-ui/styles.css';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';

import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { api } from '@/lib/api';
import { UserState } from '@/types/registration';
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import Index from './pages/Index';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { publicKey } = useWallet();
  const navigate = useNavigate();
  const [userState, setUserState] = useState<UserState>({ isVerified: false });

  useEffect(() => {
    const checkVerification = async () => {
      if (publicKey) {
        try {
          const { data: user, error } = await api.getUser(publicKey.toString());
          if (error) {
            console.error('Error fetching user:', error);
            navigate('/');
            return;
          }
          
          if (user && user.isVerified) {
            setUserState({
              isVerified: true,
              username: user.username,
              walletAddress: user.walletAddress,
            });
            return;
          }
        } catch (error) {
          console.error('Verification check error:', error);
        }
      }
      navigate('/');
    };

    checkVerification();
  }, [publicKey, navigate]);

  return userState.isVerified ? <>{children}</> : null;
};

const queryClient = new QueryClient();

const App = () => {
  const endpoint = useMemo(() => "https://mainnet-aura.metaplex.com/d2081931-cb43-4548-923f-79435343e663", []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route
                    path="/solana-visionary-terminal-main 2/*"
                    element={
                      <ProtectedRoute>
                        <Navigate to="/solana-visionary-terminal-main 2/src/pages/Index" replace />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
