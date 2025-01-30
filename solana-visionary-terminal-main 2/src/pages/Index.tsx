import { Terminal } from "@/components/Terminal/Terminal";
import { TrendingTokens } from "@/components/TrendingTokens";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <img 
            src="https://guzlanuvzfgcekmupcrx.supabase.co/storage/v1/object/public/Art//dope.png" 
            alt="DeepSolana Logo" 
            className="w-32 h-32 animate-pulse drop-shadow-[0_0_15px_rgba(147,51,234,0.7)]"
          />
        </div>
        <div className="mb-8">
          <TrendingTokens />
        </div>
        <Terminal />
      </div>
    </div>
  );
};

export default Index;