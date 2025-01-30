import React from "react";
import { Card } from "@/components/ui/card";
import { User, Twitter, MessageCircle, MessageSquare } from "lucide-react";

export const Dashboard = () => {
  return (
    <div className="w-full max-w-4xl p-6 space-y-6">
      <Card className="p-6 bg-grin-dark/80 backdrop-blur border border-grin-purple/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-grin-purple rounded-full">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Welcome Back</h2>
            <p className="text-grin-purple-light">Connected: 0x1234...5678</p>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-grin-dark/80 backdrop-blur border border-grin-purple/20">
          <div className="flex items-center gap-3">
            <Twitter className="w-5 h-5 text-grin-purple" />
            <span className="text-white">@username</span>
          </div>
        </Card>
        <Card className="p-4 bg-grin-dark/80 backdrop-blur border border-grin-purple/20">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-grin-purple" />
            <span className="text-white">@telegram</span>
          </div>
        </Card>
        <Card className="p-4 bg-grin-dark/80 backdrop-blur border border-grin-purple/20">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-grin-purple" />
            <span className="text-white">discord#1234</span>
          </div>
        </Card>
      </div>
    </div>
  );
};