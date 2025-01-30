export interface RegistrationFormData {
  username: string;
  twitterHandle: string;
  telegramHandle: string;
  discordId: string;
}

export interface UsernameValidationError {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'unique';
  message: string;
}

export interface VerificationData {
  username: string;
  walletAddress: string;
  verificationToken: string;
}

export interface UserState {
  isVerified: boolean;
  username?: string;
  walletAddress?: string;
}

export type VerificationStep = 'username' | 'wallet' | 'complete';
