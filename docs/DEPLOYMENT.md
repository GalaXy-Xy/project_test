# Deployment Guide

This guide covers deploying the Prize Pool DApp to various networks.

## Prerequisites

- Node.js 16+ and npm
- Hardhat CLI
- MetaMask or compatible wallet
- Network-specific tokens (ETH, LINK)

## Environment Setup

1. Copy the environment template:
```bash
cp contracts/env.example contracts/.env
```

2. Configure your environment variables:
```env
# Sepolia Testnet
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Chainlink VRF
VRF_COORDINATOR=0xb3dCcb4Cf7a26f6cf6Bd1a2F07dD6C1b0C6cc383
LINK_TOKEN=0x01BE23585060835E02B77ef475b0Cc51aA1e0709
KEY_HASH=0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311
FEE=100000000000000000
```

## Local Development

### 1. Start Local Hardhat Network

```bash
cd contracts
npx hardhat node
```

### 2. Deploy Contracts Locally

```bash
# In a new terminal
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Fund with LINK Tokens

```bash
# Deploy LINK token locally first
npx hardhat run scripts/deploy-link.js --network localhost

# Fund the pool
POOL_ADDRESS=0x... npx hardhat run scripts/fund-link.js --network localhost
```

## Sepolia Testnet Deployment

### 1. Get Testnet Tokens

- **Sepolia ETH**: [Sepolia Faucet](https://sepoliafaucet.com/)
- **LINK Tokens**: [Chainlink Faucet](https://faucets.chain.link/sepolia)

### 2. Deploy Contracts

```bash
cd contracts
npx hardhat run scripts/deploy.js --network sepolia
```

### 3. Verify Contracts

```bash
CONTRACT_ADDRESS=0x... npx hardhat run scripts/verify.js --network sepolia
```

### 4. Fund with LINK

```bash
POOL_ADDRESS=0x... LINK_AMOUNT=1 npx hardhat run scripts/fund-link.js --network sepolia
```

### 5. Create Test Pool

```bash
POOL_FACTORY_ADDRESS=0x... npx hardhat run scripts/create-pool.js --network sepolia
```

## Mainnet Deployment

⚠️ **Warning**: Only deploy to mainnet after thorough testing and security audits.

### 1. Update Configuration

Update `hardhat.config.js` with mainnet parameters:

```javascript
networks: {
  mainnet: {
    url: process.env.MAINNET_RPC_URL,
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 1,
  },
}
```

### 2. Deploy Contracts

```bash
cd contracts
npx hardhat run scripts/deploy.js --network mainnet
```

### 3. Verify on Etherscan

```bash
CONTRACT_ADDRESS=0x... npx hardhat run scripts/verify.js --network mainnet
```

## Frontend Deployment

### 1. Update Contract Addresses

Update `frontend/src/utils/contracts.ts` with deployed contract addresses.

### 2. Build for Production

```bash
cd frontend
npm run build
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 4. Deploy to Netlify

```bash
# Build
npm run build

# Deploy
npx netlify deploy --prod --dir=out
```

## Post-Deployment

### 1. Update Frontend Configuration

Update the following in your frontend:
- Contract addresses
- RPC URLs
- Chain IDs
- API keys

### 2. Test Functionality

- Create a test pool
- Participate in pools
- Verify VRF functionality
- Test wallet connections

### 3. Monitor Contracts

- Set up monitoring for events
- Track gas usage
- Monitor LINK token balance
- Check for failed transactions

## Troubleshooting

### Common Issues

1. **Insufficient LINK Balance**
   - Ensure pool has enough LINK for VRF requests
   - Check LINK token balance: `npx hardhat run scripts/check-link-balance.js`

2. **VRF Request Fails**
   - Verify VRF coordinator address
   - Check key hash and fee parameters
   - Ensure sufficient LINK balance

3. **Contract Verification Fails**
   - Verify constructor arguments
   - Check compiler version
   - Ensure source code matches

4. **Frontend Connection Issues**
   - Verify contract addresses
   - Check network configuration
   - Ensure wallet is connected to correct network

### Debug Commands

```bash
# Check contract state
npx hardhat run scripts/check-pool-state.js --network sepolia

# View contract events
npx hardhat run scripts/view-events.js --network sepolia

# Test VRF functionality
npx hardhat run scripts/test-vrf.js --network sepolia
```

## Security Considerations

- Use multi-sig wallets for mainnet deployment
- Implement proper access controls
- Regular security audits
- Monitor for suspicious activity
- Keep private keys secure

## Monitoring and Maintenance

- Set up event monitoring
- Track gas usage patterns
- Monitor LINK token consumption
- Regular contract health checks
- Update dependencies regularly
