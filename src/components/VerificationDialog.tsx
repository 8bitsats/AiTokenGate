import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { VerificationStep } from '@/types/registration';
import { useWallet } from '@solana/wallet-adapter-react';

interface VerificationDialogProps {
  username: string;
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export const VerificationDialog = ({
  username,
  isOpen,
  onClose,
  onVerified,
}: VerificationDialogProps) => {
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<VerificationStep>('username');

  const handleUsernameConfirm = async () => {
    if (!publicKey) return;

    try {
      // Check if username is available
      const { data, error } = await api.checkUsername(username);
      
      if (error) {
        toast({
          title: 'Error',
          description: error,
          variant: 'destructive',
        });
        return;
      }

      if (!data?.available) {
        toast({
          title: 'Error',
          description: 'Username is already taken',
          variant: 'destructive',
        });
        return;
      }

      setStep('wallet');
    } catch (error) {
      console.error('Username check error:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify username',
        variant: 'destructive',
      });
    }
  };

  const handleWalletVerify = async () => {
    if (!publicKey) return;

    try {
      const walletAddress = publicKey.toString();
      const verificationToken = 'chesh'; // Static token for now

      const { data, error } = await api.verifyUser({
        walletAddress,
        verificationToken,
      });

      if (error) {
        toast({
          title: 'Error',
          description: error,
          variant: 'destructive',
        });
        return;
      }

      if (data) {
        toast({
          title: 'Success',
          description: 'Verification complete',
        });
        onVerified();
        // Redirect to terminal
        navigate('/solana-visionary-terminal-main 2');
      }
    } catch (error) {
      console.error('Wallet verification error:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify wallet',
        variant: 'destructive',
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {step === 'username' ? 'Confirm Username' : 'Verify Wallet'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {step === 'username' ? (
              <>
                Do you want to use <strong>{username}</strong> as your username?
                This cannot be changed later.
              </>
            ) : (
              'Please verify you own this wallet by confirming with "chesh"'
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={step === 'username' ? handleUsernameConfirm : handleWalletVerify}
          >
            {step === 'username' ? 'Confirm Username' : 'Verify Wallet'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
