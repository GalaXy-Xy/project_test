# Prize Pool DApp

A decentralized prize pool lottery system built on Ethereum Sepolia testnet with fair random number generation using Chainlink VRF.

## 🎯 Features

- **Decentralized Lottery System**: Create and participate in prize pools with transparent, verifiable results
- **Chainlink VRF Integration**: Fair and verifiable random number generation
- **User-Friendly Interface**: Modern, responsive web interface built with Next.js
- **Wallet Integration**: Seamless MetaMask integration for Ethereum transactions
- **Real-time Updates**: Live participation tracking and result notifications
- **Comprehensive Testing**: Full test coverage for smart contracts and frontend

## 🏗️ Architecture

### Smart Contracts
- **PoolFactory**: Factory contract for creating new prize pools
- **PrizePool**: Individual pool contracts with VRF integration
- **Security Features**: Reentrancy protection, access controls, and input validation

### Frontend
- **Next.js 13**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Ethers.js**: Ethereum blockchain interaction
- **Context API**: State management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask wallet
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
```

3. Set up environment variables:
```bash
# Copy environment files
cp contracts/env.example contracts/.env
cp frontend/.env.example frontend/.env.local

# Edit the files with your configuration
```

4. Deploy smart contracts:
```bash
cd contracts
npm install
npm run compile
npm run deploy:sepolia
```

5. Start the development server:
```bash
npm run dev
```

## 📁 Project Structure

```
project_test/
├── contracts/                 # Smart contracts
│   ├── contracts/
│   │   ├── PoolFactory.sol   # Factory contract
│   │   └── PrizePool.sol     # Prize pool contract
│   ├── scripts/
│   │   ├── deploy.js         # Deployment script
│   │   └── verify.js         # Verification script
│   ├── test/
│   │   └── PoolFactory.test.js
│   └── package.json
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utility functions
│   │   ├── context/         # React context
│   │   ├── pages/           # Next.js pages
│   │   └── styles/          # CSS styles
│   ├── src/__tests__/       # Test files
│   └── package.json
└── docs/                    # Documentation
```

## 🔧 Configuration

### Smart Contract Configuration

Update `contracts/.env`:
```env
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### Frontend Configuration

Update `frontend/.env.local`:
```env
NEXT_PUBLIC_POOL_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
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

### Run All Tests
```bash
npm test
```

## 📖 Usage

### Creating a Prize Pool

1. Connect your MetaMask wallet
2. Navigate to "Create Pool"
3. Fill in pool parameters:
   - Pool name
   - Minimum participation amount
   - Win probability (e.g., 1 in 10)
   - Platform fee percentage
   - Duration (optional)
   - Initial funding amount
4. Click "Create Pool" and confirm the transaction

### Participating in a Pool

1. Browse available pools on the home page
2. Click "View Details" on a pool
3. Enter your participation amount (must be ≥ minimum)
4. Click "Participate Now" and confirm the transaction
5. Wait for the VRF result to determine if you won

### Viewing Your Profile

1. Click on your wallet address in the header
2. View your participation history and statistics
3. Track your winnings and performance

## 🔒 Security Features

- **Reentrancy Protection**: Prevents reentrancy attacks
- **Access Controls**: Owner-only functions for critical operations
- **Input Validation**: Comprehensive validation of all inputs
- **VRF Integration**: Verifiable random number generation
- **Gas Optimization**: Efficient contract design

## 🌐 Network Support

- **Sepolia Testnet**: Primary development and testing network
- **Ethereum Mainnet**: Production deployment (future)

## 📊 Gas Optimization

The contracts are optimized for gas efficiency:
- Minimal storage operations
- Efficient data structures
- Optimized function calls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation in `/docs`
- Review the test files for usage examples

## 🔮 Roadmap

- [ ] Multi-token support
- [ ] Advanced pool types
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] Governance features

---

Built with ❤️ by the GalaXy Team
