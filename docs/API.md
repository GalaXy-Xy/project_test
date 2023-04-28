# API Documentation

## Smart Contract API

### PoolFactory Contract

#### Functions

##### createPool
Creates a new prize pool with specified parameters.

```solidity
function createPool(
    string memory name,
    uint256 minParticipation,
    uint256 winProbability,
    uint256 winProbabilityDenominator,
    uint256 platformFeePercentage,
    uint256 duration
) external payable returns (address)
```

**Parameters:**
- `name`: Name of the prize pool
- `minParticipation`: Minimum participation amount in wei
- `winProbability`: Numerator for win probability (e.g., 1 for 1/10)
- `winProbabilityDenominator`: Denominator for win probability (e.g., 10 for 1/10)
- `platformFeePercentage`: Platform fee percentage (0-50)
- `duration`: Duration in seconds (0 for no time limit)

**Returns:**
- `address`: Address of the created prize pool

**Events:**
- `PoolCreated(address indexed poolAddress, address indexed creator, string name)`

##### getAllPools
Returns all created pools.

```solidity
function getAllPools() external view returns (address[])
```

**Returns:**
- `address[]`: Array of all pool addresses

##### getPoolCount
Returns the total number of pools.

```solidity
function getPoolCount() external view returns (uint256)
```

**Returns:**
- `uint256`: Total number of pools

##### isPool
Checks if an address is a valid pool.

```solidity
function isPool(address poolAddress) external view returns (bool)
```

**Parameters:**
- `poolAddress`: Address to check

**Returns:**
- `bool`: True if the address is a valid pool

##### getUserPools
Returns pools created by a specific user.

```solidity
function getUserPools(address user) external view returns (address[])
```

**Parameters:**
- `user`: User address

**Returns:**
- `address[]`: Array of pool addresses created by the user

### PrizePool Contract

#### Functions

##### participate
Participate in the prize pool.

```solidity
function participate() external payable
```

**Requirements:**
- Pool must be active
- Participation amount must be >= minimum participation
- Pool must not have ended

**Events:**
- `Participation(address indexed participant, uint256 amount, uint256 participationId)`
- `RandomnessRequested(uint256 requestId, address participant)`
- `WinnerSelected(address indexed winner, uint256 amount, uint256 participationId)`

##### getPoolInfo
Returns comprehensive pool information.

```solidity
function getPoolInfo() external view returns (
    string,
    uint256,
    uint256,
    uint256,
    uint256,
    uint256,
    uint256,
    uint256,
    bool
)
```

**Returns:**
- `string`: Pool name
- `uint256`: Minimum participation amount
- `uint256`: Win probability numerator
- `uint256`: Win probability denominator
- `uint256`: Platform fee percentage
- `uint256`: Total participants
- `uint256`: Total winnings
- `uint256`: Platform fees
- `bool`: Is active

##### getParticipant
Returns participant information.

```solidity
function getParticipant(uint256 participationId) external view returns (Participant)
```

**Parameters:**
- `participationId`: ID of the participation

**Returns:**
- `Participant`: Participant struct containing:
  - `address participant`: Participant address
  - `uint256 amount`: Participation amount
  - `uint256 timestamp`: Participation timestamp
  - `bool hasWon`: Whether the participant won
  - `uint256 winnings`: Amount won

##### getUserParticipations
Returns all participations by a user.

```solidity
function getUserParticipations(address user) external view returns (uint256[])
```

**Parameters:**
- `user`: User address

**Returns:**
- `uint256[]`: Array of participation IDs

##### endPool
Ends the pool (owner only).

```solidity
function endPool() external
```

**Events:**
- `PoolEnded(uint256 totalParticipants, uint256 totalWinnings)`

##### withdrawPlatformFees
Withdraws accumulated platform fees (owner only).

```solidity
function withdrawPlatformFees() external
```

**Events:**
- `PlatformFeesWithdrawn(address indexed owner, uint256 amount)`

## Frontend API

### Hooks

#### usePools
Custom hook for pool management.

```typescript
const {
  pools,
  loading,
  error,
  loadPools,
  createPool,
  participateInPool
} = usePools();
```

**Returns:**
- `pools`: Array of pool objects
- `loading`: Loading state
- `error`: Error message
- `loadPools()`: Function to load all pools
- `createPool(poolData, initialFunding)`: Function to create a pool
- `participateInPool(poolAddress, amount)`: Function to participate in a pool

#### useParticipation
Custom hook for participation tracking.

```typescript
const {
  participations,
  loading,
  error,
  loadUserParticipations,
  getParticipationStats,
  getRecentParticipations,
  getWinningParticipations
} = useParticipation(poolAddress?);
```

**Parameters:**
- `poolAddress` (optional): Specific pool address to track

**Returns:**
- `participations`: Array of participation objects
- `loading`: Loading state
- `error`: Error message
- `loadUserParticipations()`: Function to load user participations
- `getParticipationStats()`: Function to get participation statistics
- `getRecentParticipations(limit)`: Function to get recent participations
- `getWinningParticipations()`: Function to get winning participations

### Utilities

#### formatEther
Formats wei to ether string.

```typescript
formatEther(wei: string | bigint): string
```

#### parseEther
Parses ether string to wei.

```typescript
parseEther(ether: string): bigint
```

#### validatePoolCreation
Validates pool creation data.

```typescript
validatePoolCreation(data: PoolCreationData): ValidationResult
```

#### validateParticipation
Validates participation data.

```typescript
validateParticipation(amount: string, minAmount: string): ValidationResult
```

## Error Codes

### Smart Contract Errors

- `"Initial funding required"`: Pool creation requires initial funding
- `"Invalid min participation"`: Minimum participation must be > 0
- `"Invalid probability"`: Win probability must be valid
- `"Platform fee too high"`: Platform fee cannot exceed 50%
- `"Insufficient participation amount"`: Participation amount too low
- `"Pool is not active"`: Pool is not accepting participations
- `"Pool has ended"`: Pool has reached its end time
- `"Funding transfer failed"`: Failed to transfer initial funding
- `"Winnings transfer failed"`: Failed to transfer winnings
- `"Fee withdrawal failed"`: Failed to withdraw platform fees

### Frontend Errors

- `"Wallet not connected"`: MetaMask not connected
- `"Invalid amount"`: Invalid participation amount
- `"Amount is required"`: Participation amount is required
- `"Amount must be greater than 0"`: Amount must be positive
- `"Amount must be at least X ETH"`: Amount below minimum
- `"Pool name is required"`: Pool name is required
- `"Pool name must be at least 3 characters"`: Pool name too short
- `"Win probability cannot be 100%"`: Invalid probability setting
- `"Platform fee cannot exceed 50%"`: Platform fee too high

## Gas Estimates

### Pool Creation
- **Gas Used**: ~400,000 gas
- **Cost (20 gwei)**: ~0.008 ETH

### Participation
- **Gas Used**: ~150,000 gas
- **Cost (20 gwei)**: ~0.003 ETH

### Pool Ending
- **Gas Used**: ~50,000 gas
- **Cost (20 gwei)**: ~0.001 ETH

### Fee Withdrawal
- **Gas Used**: ~30,000 gas
- **Cost (20 gwei)**: ~0.0006 ETH

## Network Configuration

### Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
- **Block Explorer**: https://sepolia.etherscan.io
- **VRF Coordinator**: 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625
- **LINK Token**: 0x01BE23585060835E02B77ef475b0Cc51aA1e0709
