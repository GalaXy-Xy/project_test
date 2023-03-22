import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useApp } from '@/context/AppContext';

const POOL_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_POOL_FACTORY_ADDRESS || '';

// PoolFactory ABI (simplified)
const POOL_FACTORY_ABI = [
  'function getAllPools() external view returns (address[])',
  'function getPoolCount() external view returns (uint256)',
  'function isPool(address) external view returns (bool)',
  'event PoolCreated(address indexed poolAddress, address indexed creator, string name)'
];

// PrizePool ABI (simplified)
const PRIZE_POOL_ABI = [
  'function getPoolInfo() external view returns (string, uint256, uint256, uint256, uint256, uint256, uint256, uint256, bool)',
  'function participate() external payable',
  'function getUserParticipations(address) external view returns (uint256[])',
  'function getParticipant(uint256) external view returns (tuple(address participant, uint256 amount, uint256 timestamp, bool hasWon, uint256 winnings))',
  'event Participation(address indexed participant, uint256 amount, uint256 participationId)',
  'event WinnerSelected(address indexed winner, uint256 amount, uint256 participationId)'
];

export const usePools = () => {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPools = useCallback(async () => {
    if (!state.isConnected || !window.ethereum) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const poolFactory = new ethers.Contract(POOL_FACTORY_ADDRESS, POOL_FACTORY_ABI, provider);
      
      const poolAddresses = await poolFactory.getAllPools();
      const pools = [];

      for (let i = 0; i < poolAddresses.length; i++) {
        try {
          const poolContract = new ethers.Contract(poolAddresses[i], PRIZE_POOL_ABI, provider);
          const poolInfo = await poolContract.getPoolInfo();
          
          pools.push({
            id: i.toString(),
            name: poolInfo[0],
            minParticipation: poolInfo[1].toString(),
            winProbability: poolInfo[2].toString(),
            winProbabilityDenominator: poolInfo[3].toString(),
            platformFeePercentage: poolInfo[4].toString(),
            totalParticipants: poolInfo[5].toString(),
            totalWinnings: poolInfo[6].toString(),
            platformFees: poolInfo[7].toString(),
            isActive: poolInfo[8],
            address: poolAddresses[i],
          });
        } catch (poolError) {
          console.error(`Error loading pool ${poolAddresses[i]}:`, poolError);
        }
      }

      dispatch({ type: 'SET_POOLS', payload: pools });
    } catch (err: any) {
      setError(err.message || 'Failed to load pools');
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to load pools' });
    } finally {
      setLoading(false);
    }
  }, [state.isConnected, dispatch]);

  const createPool = useCallback(async (poolData: {
    name: string;
    minParticipation: string;
    winProbability: string;
    winProbabilityDenominator: string;
    platformFeePercentage: string;
    duration: string;
  }, initialFunding: string) => {
    if (!state.isConnected || !window.ethereum) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const poolFactory = new ethers.Contract(POOL_FACTORY_ADDRESS, POOL_FACTORY_ABI, signer);

      const tx = await poolFactory.createPool(
        poolData.name,
        ethers.parseEther(poolData.minParticipation),
        poolData.winProbability,
        poolData.winProbabilityDenominator,
        poolData.platformFeePercentage,
        poolData.duration,
        { value: ethers.parseEther(initialFunding) }
      );

      await tx.wait();
      await loadPools(); // Reload pools after creation
      
      return tx.hash;
    } catch (err: any) {
      setError(err.message || 'Failed to create pool');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [state.isConnected, loadPools]);

  const participateInPool = useCallback(async (poolAddress: string, amount: string) => {
    if (!state.isConnected || !window.ethereum) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const poolContract = new ethers.Contract(poolAddress, PRIZE_POOL_ABI, signer);

      const tx = await poolContract.participate({
        value: ethers.parseEther(amount)
      });

      await tx.wait();
      await loadPools(); // Reload pools after participation
      
      return tx.hash;
    } catch (err: any) {
      setError(err.message || 'Failed to participate in pool');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [state.isConnected, loadPools]);

  useEffect(() => {
    if (state.isConnected) {
      loadPools();
    }
  }, [state.isConnected, loadPools]);

  return {
    pools: state.pools,
    loading: loading || state.loading,
    error: error || state.error,
    loadPools,
    createPool,
    participateInPool,
  };
};
