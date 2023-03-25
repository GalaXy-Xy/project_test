import { ethers } from 'ethers';

export const CONTRACTS = {
  POOL_FACTORY: {
    address: process.env.NEXT_PUBLIC_POOL_FACTORY_ADDRESS || '',
    abi: [
      'function createPool(string memory name, uint256 minParticipation, uint256 winProbability, uint256 winProbabilityDenominator, uint256 platformFeePercentage, uint256 duration) external payable returns (address)',
      'function getAllPools() external view returns (address[])',
      'function getPoolCount() external view returns (uint256)',
      'function isPool(address) external view returns (bool)',
      'function getUserPools(address user) external view returns (address[])',
      'event PoolCreated(address indexed poolAddress, address indexed creator, string name)'
    ]
  },
  PRIZE_POOL: {
    abi: [
      'function getPoolInfo() external view returns (string, uint256, uint256, uint256, uint256, uint256, uint256, uint256, bool)',
      'function participate() external payable',
      'function getUserParticipations(address) external view returns (uint256[])',
      'function getParticipant(uint256) external view returns (tuple(address participant, uint256 amount, uint256 timestamp, bool hasWon, uint256 winnings))',
      'function endPool() external',
      'function withdrawPlatformFees() external',
      'event Participation(address indexed participant, uint256 amount, uint256 participationId)',
      'event WinnerSelected(address indexed winner, uint256 amount, uint256 participationId)',
      'event PoolEnded(uint256 totalParticipants, uint256 totalWinnings)',
      'event PlatformFeesWithdrawn(address indexed owner, uint256 amount)'
    ]
  }
};

export const NETWORKS = {
  SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia Test Network',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'SepoliaETH',
      symbol: 'SepoliaETH',
      decimals: 18,
    }
  }
};

export const getContract = (address: string, abi: any[], provider: ethers.Provider) => {
  return new ethers.Contract(address, abi, provider);
};

export const getContractWithSigner = (address: string, abi: any[], signer: ethers.Signer) => {
  return new ethers.Contract(address, abi, signer);
};

export const formatEther = (wei: string | bigint): string => {
  try {
    return parseFloat(ethers.formatEther(wei)).toFixed(4);
  } catch {
    return '0.0000';
  }
};

export const parseEther = (ether: string): bigint => {
  try {
    return ethers.parseEther(ether);
  } catch {
    return BigInt(0);
  }
};

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const isValidAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
};

export const getExplorerUrl = (txHash: string, network = 'sepolia'): string => {
  const explorers = {
    sepolia: 'https://sepolia.etherscan.io',
    mainnet: 'https://etherscan.io',
  };
  
  return `${explorers[network as keyof typeof explorers] || explorers.sepolia}/tx/${txHash}`;
};

export const getAddressExplorerUrl = (address: string, network = 'sepolia'): string => {
  const explorers = {
    sepolia: 'https://sepolia.etherscan.io',
    mainnet: 'https://etherscan.io',
  };
  
  return `${explorers[network as keyof typeof explorers] || explorers.sepolia}/address/${address}`;
};
