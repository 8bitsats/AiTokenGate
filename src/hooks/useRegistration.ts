import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import {
  RegistrationFormData,
  UserState,
} from '@/types/registration';
import { useWallet } from '@solana/wallet-adapter-react';

export const useRegistration = (initialState?: UserState) => {
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const registerProfile = async (formData: RegistrationFormData) => {
    if (!publicKey) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const walletAddress = publicKey.toString();
      
      // Get user profile
      const { data: user, error: getUserError } = await api.getUser(walletAddress);
      
      if (getUserError) {
        throw new Error(getUserError);
      }
      
      if (!user) {
        throw new Error('Please verify your wallet first');
      }

      if (!user.isVerified) {
        throw new Error('Please complete wallet verification');
      }

      // Register user profile
      const { error: registerError } = await api.registerUser({
        username: user.username,
        walletAddress,
        verificationToken: 'chesh',
        twitterHandle: formData.twitterHandle,
        telegramHandle: formData.telegramHandle,
        discordId: formData.discordId,
      });

      if (registerError) {
        throw new Error(registerError);
      }

      toast({
        title: "Success",
        description: "Your profile has been registered successfully",
      });
      
      // Redirect to terminal
      navigate("/solana-visionary-terminal-main 2");
      
    } catch (error: Error | unknown) {
      console.error("Registration error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to register profile";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { registerProfile, isLoading };
};
