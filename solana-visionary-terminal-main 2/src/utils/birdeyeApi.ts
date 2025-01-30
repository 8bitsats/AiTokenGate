import { supabase } from "@/integrations/supabase/client";

export interface TrendingToken {
  address: string;
  decimals: number;
  liquidity: number;
  logoURI: string;
  name: string;
  symbol: string;
  volume24hUSD: number;
  rank: number;
  price: number;
  price24hChangePercent: number;
}

export interface TokenMetadata {
  address: string;
  chainId: number;
  decimals: number;
  logo_uri: string;
  name: string;
  symbol: string;
  extensions: {
    description?: string;
    website?: string;
    twitter?: string;
    discord?: string;
    medium?: string;
  };
}

export interface TokenBalance {
  address: string;
  uiAmount: number;
  valueUsd: number;
  priceUsd: number;
  name?: string;
  symbol?: string;
}

export interface WalletPortfolio {
  totalUsd: number;
  items: TokenBalance[];
}

export const fetchTrendingTokens = async (): Promise<TrendingToken[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('birdeye-operations', {
      body: { operation: 'trending-tokens' }
    });

    if (error) throw error;
    if (!data.success) throw new Error('Failed to fetch trending tokens');

    return data.data.tokens;
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    return [];
  }
};

export const fetchTokenMetadata = async (address: string): Promise<TokenMetadata> => {
  try {
    const { data, error } = await supabase.functions.invoke('birdeye-operations', {
      body: { operation: 'token-metadata', address }
    });

    if (error) throw error;
    if (!data.success) throw new Error('Failed to fetch token metadata');

    return data.data;
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    throw error;
  }
};

export const fetchWalletPortfolio = async (walletAddress: string): Promise<WalletPortfolio> => {
  try {
    const { data, error } = await supabase.functions.invoke('birdeye-operations', {
      body: { operation: 'wallet-portfolio', walletAddress }
    });

    if (error) throw error;
    if (!data.success) throw new Error('Failed to fetch wallet portfolio');

    return data.data;
  } catch (error) {
    console.error('Error fetching wallet portfolio:', error);
    throw error;
  }
};

export const fetchTokenBalance = async (walletAddress: string, tokenAddress: string): Promise<TokenBalance> => {
  try {
    const { data, error } = await supabase.functions.invoke('birdeye-operations', {
      body: { operation: 'token-balance', walletAddress, tokenAddress }
    });

    if (error) throw error;
    if (!data.success) throw new Error('Failed to fetch token balance');

    return data.data;
  } catch (error) {
    console.error('Error fetching token balance:', error);
    throw error;
  }
};