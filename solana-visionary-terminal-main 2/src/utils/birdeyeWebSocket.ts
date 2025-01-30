export class BirdeyeWebSocket {
  private ws: WebSocket | null = null;
  private onPriceUpdate: (price: any) => void;

  constructor(onPriceUpdate: (price: any) => void) {
    this.onPriceUpdate = onPriceUpdate;
  }

  connect(tokenAddress: string) {
    const wsUrl = `wss://public-api.birdeye.so/socket/solana?x-api-key=${process.env.BIRDEYE_API_KEY}`;
    
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket Connected');
      this.subscribe(tokenAddress);
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.onPriceUpdate(data);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket Connection Closed');
    };
  }

  private subscribe(tokenAddress: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const msg = {
        type: "SUBSCRIBE_PRICE",
        data: {
          chartType: "1m",
          currency: "usd",
          address: tokenAddress
        }
      };
      this.ws.send(JSON.stringify(msg));
    }
  }

  disconnect() {
    if (this.ws) {
      const msg = {
        type: "UNSUBSCRIBE_PRICE"
      };
      this.ws.send(JSON.stringify(msg));
      this.ws.close();
      this.ws = null;
    }
  }
}