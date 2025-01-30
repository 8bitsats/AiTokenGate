import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const BIRDEYE_API_BASE = 'https://public-api.birdeye.so';

interface RequestBody {
  operation: string;
  address?: string;
  walletAddress?: string;
  tokenAddress?: string;
}

serve(async (req) => {
  try {
    const { operation, address, walletAddress, tokenAddress } = await req.json() as RequestBody;
    const apiKey = Deno.env.get('BIRDEYE_API_KEY');

    if (!apiKey) {
      throw new Error('BIRDEYE_API_KEY is not configured');
    }

    const headers = {
      'X-API-KEY': apiKey,
      'accept': 'application/json',
      'x-chain': 'solana',
    };

    let endpoint = '';
    let response;

    switch (operation) {
      case 'trending-tokens':
        endpoint = '/defi/token_trending?sort_by=rank&sort_type=asc&offset=0&limit=20';
        break;
      case 'token-metadata':
        if (!address) throw new Error('Token address is required');
        endpoint = `/public/token_metadata?address=${address}`;
        break;
      case 'wallet-portfolio':
        if (!walletAddress) throw new Error('Wallet address is required');
        endpoint = `/defi/wallet_portfolio?wallet=${walletAddress}`;
        break;
      case 'token-balance':
        if (!walletAddress || !tokenAddress) throw new Error('Wallet and token addresses are required');
        endpoint = `/defi/wallet_token?wallet=${walletAddress}&token=${tokenAddress}`;
        break;
      default:
        throw new Error('Invalid operation');
    }

    response = await fetch(`${BIRDEYE_API_BASE}${endpoint}`, { headers });
    const data = await response.json();

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    );
  }
})