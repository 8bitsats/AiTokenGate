import React, { useState } from 'react';

import {
  MessageCircle,
  MessageSquare,
  Twitter,
} from 'lucide-react';

import { SocialInput } from '@/components/SocialInput';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UsernameInput } from '@/components/UsernameInput';
import { VerificationDialog } from '@/components/VerificationDialog';
import { useRegistration } from '@/hooks/useRegistration';
import { RegistrationFormData } from '@/types/registration';

export const RegistrationForm = () => {
  const { registerProfile, isLoading } = useRegistration();
  const [formData, setFormData] = useState<RegistrationFormData>({
    username: '',
    twitterHandle: '',
    telegramHandle: '',
    discordId: '',
  });
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [showVerification, setShowVerification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowVerification(true);
  };

  const handleVerified = async () => {
    await registerProfile(formData);
    setShowVerification(false);
  };

  return (
    <Card className="w-full max-w-md p-6 bg-grin-dark/80 backdrop-blur border border-grin-purple/20">
      <h2 className="text-2xl font-bold text-white mb-6">Complete Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <UsernameInput
          value={formData.username}
          onChange={handleInputChange}
          onValidation={setIsUsernameValid}
        />
        <SocialInput
          name="twitterHandle"
          value={formData.twitterHandle}
          onChange={handleInputChange}
          placeholder="Twitter Handle"
          Icon={Twitter}
        />
        <SocialInput
          name="telegramHandle"
          value={formData.telegramHandle}
          onChange={handleInputChange}
          placeholder="Telegram Handle"
          Icon={MessageCircle}
        />
        <SocialInput
          name="discordId"
          value={formData.discordId}
          onChange={handleInputChange}
          placeholder="Discord ID"
          Icon={MessageSquare}
        />
        <Button 
          type="submit"
          disabled={isLoading || !isUsernameValid}
          className="w-full bg-grin-purple hover:bg-grin-purple-dark text-white"
        >
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>
      <VerificationDialog
        username={formData.username}
        isOpen={showVerification}
        onClose={() => setShowVerification(false)}
        onVerified={handleVerified}
      />
    </Card>
  );
};
