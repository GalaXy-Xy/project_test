// Contract addresses and ABIs
export const CONTRACT_ADDRESSES = {
  POOL_FACTORY: process.env.NEXT_PUBLIC_POOL_FACTORY_ADDRESS || '0x0000000000000000000000000000000000000000',
  // Add other contract addresses as needed
}

export const POOL_FACTORY_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "uint256", "name": "_minParticipation", "type": "uint256" },
      { "internalType": "uint256", "name": "_winProbability", "type": "uint256" },
      { "internalType": "uint256", "name": "_platformFeePercent", "type": "uint256" },
      { "internalType": "uint256", "name": "_duration", "type": "uint256" }
    ],
    "name": "createPool",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPools",
    "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPoolCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
]

export const PRIZE_POOL_ABI = [
  {
    "inputs": [],
    "name": "participate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPoolInfo",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "bool", "name": "", "type": "bool" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getUserHistory",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "user", "type": "address" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "bool", "name": "hasWon", "type": "bool" },
          { "internalType": "uint256", "name": "reward", "type": "uint256" }
        ],
        "internalType": "struct PrizePool.Participant[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

// Utility functions
export const formatEther = (wei: string | bigint): string => {
  // Convert wei to ether
  const weiValue = typeof wei === 'string' ? BigInt(wei) : wei
  const etherValue = Number(weiValue) / 1e18
  return etherValue.toFixed(4)
}

export const parseEther = (ether: string): bigint => {
  // Convert ether to wei
  const etherValue = parseFloat(ether)
  return BigInt(Math.floor(etherValue * 1e18))
}

export const formatAddress = (address: string): string => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatTimeRemaining = (endTime: number): string => {
  const now = Date.now()
  const diff = endTime - now
  if (diff <= 0) return 'Ended'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}
