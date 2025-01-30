import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  fetchTokenMetadata,
  fetchTrendingTokens,
  TokenMetadata,
  TrendingToken,
} from '../utils/birdeyeApi';
import { Card } from './ui/card';

export const TrendingTokens = () => {
  const [tokens, setTokens] = useState<TrendingToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<TrendingToken | null>(null);
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number>();

  const fetchTokens = useCallback(async () => {
    try {
      const data = await fetchTrendingTokens();
      setTokens(data);
    } catch (error) {
      console.error("Failed to fetch trending tokens:", error);
    }
  }, []);

  const handleTokenClick = async (token: TrendingToken) => {
    setIsPaused(true);
    setSelectedToken(token);
    try {
      const metadata = await fetchTokenMetadata(token.address);
      setTokenMetadata(metadata);
    } catch (error) {
      console.error("Failed to fetch token metadata:", error);
    }
  };

  const scrollTicker = useCallback(() => {
    if (tickerRef.current && !isPaused) {
      tickerRef.current.scrollLeft += 1;
      if (
        tickerRef.current.scrollLeft >=
        tickerRef.current.scrollWidth - tickerRef.current.clientWidth
      ) {
        tickerRef.current.scrollLeft = 0;
      }
    }
  }, [isPaused]);

  useEffect(() => {
    fetchTokens();
    const refreshInterval = setInterval(fetchTokens, 60000);
    return () => clearInterval(refreshInterval);
  }, [fetchTokens]);

  useEffect(() => {
    scrollIntervalRef.current = window.setInterval(scrollTicker, 50);
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [scrollTicker]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: price < 1 ? 6 : 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatPercentage = (percent: number) => {
    return `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`;
  };

  return (
    <div className="w-full">
      <div
        ref={tickerRef}
        className="overflow-x-hidden whitespace-nowrap py-2 bg-gradient-to-br from-black to-gray-900 border-y border-gray-800"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => !selectedToken && setIsPaused(false)}
      >
        <div className="inline-block">
          {tokens.map((token) => (
            <button
              key={token.address}
              onClick={() => handleTokenClick(token)}
              className="inline-flex items-center mx-4 hover:bg-gray-800/50 rounded-lg px-2 py-1 transition-colors"
            >
              <img
                src={token.logoURI}
                alt={token.name}
                className="w-6 h-6 rounded-full mr-2"
              />
              <span className="font-medium">{token.symbol}</span>
              <span
                className={`ml-2 ${
                  token.price24hChangePercent >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {formatPrice(token.price)}
              </span>
              <span
                className={`ml-2 ${
                  token.price24hChangePercent >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {formatPercentage(token.price24hChangePercent)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedToken && tokenMetadata && (
        <Card className="mt-4 p-6 bg-gradient-to-br from-black to-gray-900 border-gray-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <img
                src={tokenMetadata.logo_uri}
                alt={tokenMetadata.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h2 className="text-2xl font-bold">{tokenMetadata.name}</h2>
                <p className="text-muted-foreground">{tokenMetadata.symbol}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedToken(null);
                setTokenMetadata(null);
                setIsPaused(false);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-lg font-medium">
                {formatPrice(selectedToken.price)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">24h Change</p>
              <p
                className={`text-lg font-medium ${
                  selectedToken.price24hChangePercent >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {formatPercentage(selectedToken.price24hChangePercent)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">24h Volume</p>
              <p className="text-lg font-medium">
                {formatPrice(selectedToken.volume24hUSD)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Liquidity</p>
              <p className="text-lg font-medium">
                {formatPrice(selectedToken.liquidity)}
              </p>
            </div>
          </div>

          {tokenMetadata.extensions.description && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="mt-1">{tokenMetadata.extensions.description}</p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-4">
            {tokenMetadata.extensions.website && (
              <a
                href={tokenMetadata.extensions.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Website
              </a>
            )}
            {tokenMetadata.extensions.twitter && (
              <a
                href={tokenMetadata.extensions.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Twitter
              </a>
            )}
            {tokenMetadata.extensions.discord && (
              <a
                href={tokenMetadata.extensions.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Discord
              </a>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};