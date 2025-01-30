# Cheshire Terminal - Solana Token Gate

A streamlined authentication system for Solana dApps that combines wallet verification with username registration in a sleek, terminal-inspired interface.

## Overview

Cheshire Terminal's token gate system provides a simplified login process for Solana applications by:
- Connecting users' Solana wallets
- Allowing unique username registration
- Verifying wallet ownership
- Managing user profiles in MongoDB

## Features

### 1. Simplified Authentication Flow
- One-click wallet connection using Phantom
- Username selection with real-time validation
- Two-step verification process (username + wallet)
- Persistent session management

### 2. Username System
- Unique usernames per wallet
- Real-time availability checking
- Format validation (3-20 characters, alphanumeric + underscores)
- Permanent username assignment for consistency

### 3. Wallet Integration
- Built on @solana/wallet-adapter
- Supports Phantom wallet
- Metaplex DAS RPC integration
- Secure wallet ownership verification

### 4. User Management
- MongoDB-based user profiles
- Username-wallet address mapping
- Social handle storage (Twitter, Telegram, Discord)
- Verification status tracking

## Technical Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Blockchain**: Solana Web3.js
- **Database**: MongoDB
- **State Management**: React Query
- **Routing**: React Router

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/8bitsats/AiTokenGate.git
cd AiTokenGate
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```env
MONGODB_URI=your_mongodb_uri
METAPLEX_SOLANA_DAS_RPC=your_metaplex_rpc_url
```

4. Start the development server:
```bash
npm run dev
```

## Usage

1. **Connect Wallet**
   - Click "Connect" to initiate Phantom wallet connection
   - Approve the connection request in Phantom

2. **Choose Username**
   - Enter desired username
   - System validates availability and format
   - Confirm username selection

3. **Verify Wallet**
   - Confirm wallet ownership with "chesh" token
   - Complete verification process

4. **Access Terminal**
   - Automatic redirect to terminal interface
   - Persistent authentication across sessions

## Architecture

```
src/
├── components/         # UI components
│   ├── VerificationDialog.tsx
│   ├── UsernameInput.tsx
│   └── RegistrationForm.tsx
├── hooks/             # Custom React hooks
│   └── useRegistration.ts
├── lib/              # Core utilities
│   ├── api.ts        # API service
│   └── mongodb.ts    # Database connection
└── types/            # TypeScript definitions
```

## Security Features

- Unique username enforcement
- Wallet ownership verification
- Protected route middleware
- MongoDB unique indexes
- Real-time validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Solana Foundation for wallet adapter
- Metaplex for DAS RPC
- MongoDB team for database
- shadcn for UI components

## Contact

Project Link: [https://github.com/8bitsats/AiTokenGate](https://github.com/8bitsats/AiTokenGate)
