# Prize Pool DApp

A decentralized lottery system built on Ethereum Sepolia testnet, powered by Chainlink VRF for fair and verifiable randomness.

## 🎯 Features

- **Decentralized Prize Pools**: Create and participate in transparent prize pools
- **Fair Randomness**: Powered by Chainlink VRF for verifiable random number generation
- **User-Friendly Interface**: Modern React frontend with wallet integration
- **Secure Smart Contracts**: Built with OpenZeppelin security standards
- **Real-time Updates**: Live participation tracking and results

## 🏗️ Architecture

### Smart Contracts
- **PoolFactory**: Creates and manages prize pools
- **PrizePool**: Individual pool contracts with VRF integration
- **PoolFactoryV2**: Enhanced factory with advanced features
- **PrizePoolV2**: Improved pool contract with pausable functionality

### Frontend
- **Next.js 13**: React framework with TypeScript
- **Tailwind CSS**: Modern styling and responsive design
- **Wagmi**: Ethereum wallet integration
- **RainbowKit**: Wallet connection UI

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git
- MetaMask or compatible wallet
- Sepolia ETH for testing

### Installation

1. Clone the repository:
```bash
git clone https://github.com/GalaXy-Xy/project_test.git
cd project_test
```

2. Install dependencies:
```bash
npm install
cd contracts && npm install
cd ../frontend && npm install
```

3. Set up environment variables:
```bash
# Copy environment template
cp contracts/env.example contracts/.env

# Edit with your values
nano contracts/.env
```

4. Deploy contracts:
```bash
cd contracts
npm run compile
npm run deploy:sepolia
```

5. Start the frontend:
```bash
cd ../frontend
npm run dev
```

## 📖 Usage

### Creating a Prize Pool

1. Connect your wallet to the Sepolia testnet
2. Navigate to "Create Pool"
3. Fill in pool parameters:
   - Pool name
   - Minimum participation amount
   - Win probability (1-100%)
   - Platform fee percentage
   - Pool duration
   - Initial funding amount
4. Click "Create Prize Pool"

### Participating in Pools

1. Browse available pools on the homepage
2. Click "View Details" on any pool
3. Enter your participation amount
4. Click "Participate Now"
5. Confirm the transaction in your wallet

### Viewing Results

- Check your participation history in "My Profile"
- View real-time pool statistics
- Track your win rate and total rewards

## 🔧 Development

### Smart Contract Development

```bash
cd contracts

# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to local network
npm run node
npm run deploy:local

# Deploy to Sepolia
npm run deploy:sepolia
```

### Frontend Development

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🧪 Testing

### Smart Contract Tests
```bash
cd contracts
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📁 Project Structure

```
project_test/
├── contracts/                 # Smart contracts
│   ├── contracts/            # Solidity contracts
│   ├── scripts/              # Deployment scripts
│   ├── test/                 # Test files
│   └── hardhat.config.js     # Hardhat configuration
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Next.js pages
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utility functions
│   │   └── context/         # React context
│   └── public/              # Static assets
└── docs/                    # Documentation
```

## 🔒 Security

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Ownable**: Access control for sensitive functions
- **Pausable**: Emergency pause functionality
- **Input Validation**: Comprehensive parameter validation
- **VRF Integration**: Cryptographically secure randomness

## 🌐 Network Configuration

### Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
- **LINK Token**: 0x01BE23585060835E02B77ef475b0Cc51aA1e0709
- **VRF Coordinator**: 0xb3dCcb4Cf7a26f6cf6Bd1a2F07dD6C1b0C6cc383

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team

## 🎉 Acknowledgments

- Chainlink for VRF integration
- OpenZeppelin for security standards
- Next.js team for the framework
- RainbowKit for wallet integration
