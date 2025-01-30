import React from "react";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface SocialInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  Icon: LucideIcon;
}

export const SocialInput = ({ name, value, onChange, placeholder, Icon }: SocialInputProps) => {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-3 w-5 h-5 text-grin-purple" />
      <Input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10 bg-black/20 border-grin-purple/30 text-white"
      />
    </div>
  );
};