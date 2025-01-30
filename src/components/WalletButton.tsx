import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const WalletButton = () => {
  return (
    <WalletMultiButton className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-purple-500/50 transition-all" />
  );
};