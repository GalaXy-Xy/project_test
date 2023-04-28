# Deployment Guide

This guide covers deploying the Prize Pool DApp to various environments.

## Prerequisites

- Node.js 18+
- npm or yarn
- Git
- MetaMask wallet
- Sepolia ETH for testing
- Infura/Alchemy account for RPC endpoints

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/GalaXy-Xy/project_test.git
cd project_test
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install contract dependencies
cd contracts
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Variables

#### Smart Contracts (.env)

Create `contracts/.env`:

```env
# Sepolia Testnet Configuration
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Chainlink VRF Configuration
VRF_COORDINATOR=0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625
LINK_TOKEN=0x01BE23585060835E02B77ef475b0Cc51aA1e0709
KEY_HASH=0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c
FEE=1000000000000000000
```

#### Frontend (.env.local)

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_POOL_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Smart Contract Deployment

### 1. Compile Contracts

```bash
cd contracts
npm run compile
```

### 2. Run Tests

```bash
npm test
```

### 3. Deploy to Sepolia

```bash
npm run deploy
```

### 4. Verify Contracts

```bash
# Set contract address
export CONTRACT_ADDRESS=0x...

# Verify
npm run verify
```

### 5. Update Frontend Configuration

Update `frontend/.env.local` with the deployed contract address:

```env
NEXT_PUBLIC_POOL_FACTORY_ADDRESS=0x[deployed_address]
```

## Frontend Deployment

### 1. Build Application

```bash
cd frontend
npm run build
```

### 2. Test Production Build

```bash
npm start
```

### 3. Deploy to Vercel

#### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_POOL_FACTORY_ADDRESS
vercel env add NEXT_PUBLIC_CHAIN_ID
vercel env add NEXT_PUBLIC_RPC_URL
```

#### Option B: GitHub Integration

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### 4. Deploy to Netlify

```bash
# Build
npm run build

# Deploy
npx netlify deploy --prod --dir=out
```

### 5. Deploy to AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload to S3
aws s3 sync out/ s3://your-bucket-name

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Docker Deployment

### 1. Create Dockerfile

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 2. Build and Run

```bash
# Build image
docker build -t prize-pool-dapp .

# Run container
docker run -p 3000:3000 prize-pool-dapp
```

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build contracts
      run: |
        cd contracts
        npm ci
        npm run compile
        npm run test
    
    - name: Deploy contracts
      run: |
        cd contracts
        npm run deploy
      env:
        SEPOLIA_URL: ${{ secrets.SEPOLIA_URL }}
        PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
        ETHERSCAN_API_KEY: ${{ secrets.ETHERSCAN_API_KEY }}
    
    - name: Build frontend
      run: |
        cd frontend
        npm ci
        npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./frontend
```

## Monitoring and Maintenance

### 1. Health Checks

Create health check endpoints:

```typescript
// pages/api/health.ts
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
}
```

### 2. Error Tracking

Integrate with Sentry:

```bash
npm install @sentry/nextjs
```

### 3. Analytics

Add Google Analytics or similar:

```typescript
// utils/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};
```

### 4. Performance Monitoring

Monitor with Vercel Analytics or similar service.

## Security Considerations

### 1. Environment Variables

- Never commit `.env` files
- Use strong, unique private keys
- Rotate keys regularly
- Use different keys for different environments

### 2. Smart Contract Security

- Audit contracts before mainnet deployment
- Use multi-sig wallets for contract ownership
- Implement upgrade mechanisms if needed
- Monitor for suspicious activity

### 3. Frontend Security

- Validate all inputs
- Use HTTPS in production
- Implement CSP headers
- Regular dependency updates

## Troubleshooting

### Common Issues

1. **Contract deployment fails**
   - Check private key and RPC URL
   - Ensure sufficient ETH for gas
   - Verify network connectivity

2. **Frontend build fails**
   - Check environment variables
   - Verify Node.js version
   - Clear node_modules and reinstall

3. **VRF not working**
   - Verify VRF coordinator address
   - Check LINK token balance
   - Ensure subscription is active

### Support

For deployment issues:
- Check GitHub Issues
- Review documentation
- Contact team via Discord/Telegram
