# API Documentation

This document describes the smart contract interfaces and frontend API for the Prize Pool DApp.

## Smart Contract Interfaces

### PoolFactory Contract

#### Functions

##### createPool
Creates a new prize pool with specified parameters.

```solidity
function createPool(
    string memory _name,
    uint256 _minParticipation,
    uint256 _winProbability,
    uint256 _platformFeePercent,
    uint256 _duration
) external payable returns (address)
```

**Parameters:**
- `_name`: Name of the prize pool
- `_minParticipation`: Minimum ETH amount required to participate
- `_winProbability`: Win probability percentage (1-100)
- `_platformFeePercent`: Platform fee percentage (0-20)
- `_duration`: Pool duration in seconds

**Returns:**
- `address`: Address of the created prize pool contract

**Events:**
- `PoolCreated(address indexed poolAddress, address indexed creator, string name)`

##### getPools
Returns all created pool addresses.

```solidity
function getPools() external view returns (address[])
```

**Returns:**
- `address[]`: Array of all pool addresses

##### getPoolCount
Returns the total number of created pools.

```solidity
function getPoolCount() external view returns (uint256)
```

**Returns:**
- `uint256`: Total number of pools

### PrizePool Contract

#### Functions

##### participate
Participate in the prize pool by sending ETH.

```solidity
function participate() external payable
```

**Requirements:**
- Pool must be active
- Pool must not have ended
- Sent amount must be >= minimum participation
- Pool must have sufficient LINK tokens for VRF

**Events:**
- `Participation(address indexed user, uint256 amount, uint256 requestId)`

##### getPoolInfo
Returns comprehensive pool information.

```solidity
function getPoolInfo() external view returns (
    string memory,
    uint256,
    uint256,
    uint256,
    uint256,
    bool,
    uint256
)
```

**Returns:**
- `string`: Pool name
- `uint256`: Minimum participation amount
- `uint256`: Win probability percentage
- `uint256`: Current pool balance
- `uint256`: Total participants
- `bool`: Is pool active
- `uint256`: End time timestamp

##### getUserHistory
Returns participation history for a specific user.

```solidity
function getUserHistory(address user) external view returns (Participant[] memory)
```

**Parameters:**
- `user`: User address to query

**Returns:**
- `Participant[]`: Array of participation records

##### endPool
Ends the pool (owner only).

```solidity
function endPool() external onlyOwner
```

**Events:**
- `PoolEnded(uint256 totalRewards, uint256 platformFees)`

##### withdrawPlatformFees
Withdraws accumulated platform fees (owner only).

```solidity
function withdrawPlatformFees() external onlyOwner
```

### PrizePoolV2 Contract

#### Additional Functions

##### pausePool
Pauses the pool (owner only).

```solidity
function pausePool() external onlyOwner
```

**Events:**
- `PoolPaused(address indexed by)`

##### unpausePool
Unpauses the pool (owner only).

```solidity
function unpausePool() external onlyOwner
```

**Events:**
- `PoolUnpaused(address indexed by)`

##### getUserStats
Returns comprehensive user statistics.

```solidity
function getUserStats(address user) external view returns (
    uint256 participationCount,
    uint256 totalAmount,
    uint256 winCount,
    uint256 totalRewards
)
```

**Returns:**
- `participationCount`: Number of participations
- `totalAmount`: Total ETH participated
- `winCount`: Number of wins
- `totalRewards`: Total rewards received

## Frontend API

### Hooks

#### usePools
Custom hook for fetching and managing pool data.

```typescript
function usePools(): {
  pools: Pool[]
  loading: boolean
  error: string | null
  refetch: () => void
}
```

**Returns:**
- `pools`: Array of pool objects
- `loading`: Loading state
- `error`: Error message if any
- `refetch`: Function to refetch data

#### usePool
Custom hook for fetching individual pool data.

```typescript
function usePool(poolId: string): {
  pool: Pool | null
  loading: boolean
  error: string | null
}
```

**Parameters:**
- `poolId`: Pool address or ID

**Returns:**
- `pool`: Pool object or null
- `loading`: Loading state
- `error`: Error message if any

#### useParticipation
Custom hook for managing user participation.

```typescript
function useParticipation(poolAddress?: string): {
  participations: Participation[]
  loading: boolean
  error: string | null
}
```

**Parameters:**
- `poolAddress`: Optional pool address to filter participations

**Returns:**
- `participations`: Array of participation records
- `loading`: Loading state
- `error`: Error message if any

#### usePoolParticipation
Custom hook for participating in pools.

```typescript
function usePoolParticipation(
  poolAddress: string,
  amount: string
): {
  participate: () => void
  isLoading: boolean
  isSuccess: boolean
  error: string | undefined
}
```

**Parameters:**
- `poolAddress`: Pool contract address
- `amount`: Participation amount in ETH

**Returns:**
- `participate`: Function to participate
- `isLoading`: Transaction loading state
- `isSuccess`: Transaction success state
- `error`: Error message if any

### Context

#### AppContext
Global application state management.

```typescript
interface AppState {
  selectedPool: string | null
  userStats: {
    totalParticipations: number
    totalWon: number
    totalRewards: string
    winRate: number
  }
  notifications: Notification[]
}
```

**Functions:**
- `setSelectedPool(poolId: string | null)`: Set selected pool
- `updateUserStats(stats: Partial<UserStats>)`: Update user statistics
- `addNotification(notification: Notification)`: Add notification
- `removeNotification(id: string)`: Remove notification
- `clearNotifications()`: Clear all notifications

### Utilities

#### Contract Utilities

```typescript
// Format wei to ether
function formatEther(wei: string | bigint): string

// Parse ether to wei
function parseEther(ether: string): bigint

// Format address for display
function formatAddress(address: string): string

// Format time remaining
function formatTimeRemaining(endTime: number): string
```

#### Contract Addresses

```typescript
const CONTRACT_ADDRESSES = {
  POOL_FACTORY: '0x...',
  // Add other addresses as needed
}
```

#### ABI Definitions

```typescript
const POOL_FACTORY_ABI = [
  // ABI definition
]

const PRIZE_POOL_ABI = [
  // ABI definition
]
```

## Error Handling

### Common Errors

1. **Insufficient Participation Amount**
   - Error: "Insufficient participation amount"
   - Solution: Increase participation amount to meet minimum requirement

2. **Pool Not Active**
   - Error: "Pool is not active"
   - Solution: Pool has ended or been paused

3. **Insufficient LINK Balance**
   - Error: "Not enough LINK"
   - Solution: Fund pool with LINK tokens

4. **Pool Full**
   - Error: "Pool is full"
   - Solution: Pool has reached maximum participants

5. **Max Participation Exceeded**
   - Error: "Max participation per user exceeded"
   - Solution: User has reached participation limit

### Error Codes

| Code | Description |
|------|-------------|
| 1 | Invalid parameters |
| 2 | Insufficient funds |
| 3 | Pool not active |
| 4 | Access denied |
| 5 | Contract paused |

## Events

### PoolFactory Events

- `PoolCreated(address indexed poolAddress, address indexed creator, string name)`

### PrizePool Events

- `Participation(address indexed user, uint256 amount, uint256 requestId)`
- `Winner(address indexed user, uint256 reward, uint256 randomNumber)`
- `PoolEnded(uint256 totalRewards, uint256 platformFees)`

### PrizePoolV2 Events

- `PoolPaused(address indexed by)`
- `PoolUnpaused(address indexed by)`
- `EmergencyWithdraw(address indexed to, uint256 amount)`

## Rate Limits

- Maximum 10 pools per creator (configurable)
- Maximum 100 participations per user per pool (configurable)
- VRF requests limited by LINK token balance
- Gas limit: 500,000 per transaction

## Security Considerations

- All functions include proper access controls
- Reentrancy protection on all external functions
- Input validation on all parameters
- Emergency pause functionality available
- Owner-only functions clearly marked
