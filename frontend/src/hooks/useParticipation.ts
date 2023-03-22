import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useApp } from '@/context/AppContext';

const PRIZE_POOL_ABI = [
  'function getUserParticipations(address) external view returns (uint256[])',
  'function getParticipant(uint256) external view returns (tuple(address participant, uint256 amount, uint256 timestamp, bool hasWon, uint256 winnings))',
  'event Participation(address indexed participant, uint256 amount, uint256 participationId)',
  'event WinnerSelected(address indexed winner, uint256 amount, uint256 participationId)'
];

export const useParticipation = (poolAddress?: string) => {
  const { state, dispatch } = useApp();
  const [participations, setParticipations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserParticipations = useCallback(async () => {
    if (!state.isConnected || !state.account || !window.ethereum) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      if (poolAddress) {
        // Load participations for specific pool
        const poolContract = new ethers.Contract(poolAddress, PRIZE_POOL_ABI, provider);
        const participationIds = await poolContract.getUserParticipations(state.account);
        
        const userParticipations = [];
        for (const id of participationIds) {
          try {
            const participation = await poolContract.getParticipant(id);
            userParticipations.push({
              poolId: poolAddress,
              participationId: id.toString(),
              amount: participation.amount.toString(),
              timestamp: Number(participation.timestamp),
              hasWon: participation.hasWon,
              winnings: participation.winnings.toString(),
            });
          } catch (participationError) {
            console.error(`Error loading participation ${id}:`, participationError);
          }
        }
        
        setParticipations(userParticipations);
      } else {
        // Load all user participations across all pools
        const allParticipations = [];
        
        for (const pool of state.pools) {
          try {
            const poolContract = new ethers.Contract(pool.address, PRIZE_POOL_ABI, provider);
            const participationIds = await poolContract.getUserParticipations(state.account);
            
            for (const id of participationIds) {
              try {
                const participation = await poolContract.getParticipant(id);
                allParticipations.push({
                  poolId: pool.address,
                  poolName: pool.name,
                  participationId: id.toString(),
                  amount: participation.amount.toString(),
                  timestamp: Number(participation.timestamp),
                  hasWon: participation.hasWon,
                  winnings: participation.winnings.toString(),
                });
              } catch (participationError) {
                console.error(`Error loading participation ${id}:`, participationError);
              }
            }
          } catch (poolError) {
            console.error(`Error loading participations for pool ${pool.address}:`, poolError);
          }
        }
        
        setParticipations(allParticipations);
        dispatch({ type: 'SET_USER_PARTICIPATIONS', payload: allParticipations });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load participations');
    } finally {
      setLoading(false);
    }
  }, [state.isConnected, state.account, state.pools, poolAddress, dispatch]);

  const getParticipationStats = useCallback(() => {
    const totalParticipations = participations.length;
    const totalWon = participations.filter(p => p.hasWon).length;
    const totalWinnings = participations.reduce((sum, p) => sum + parseFloat(ethers.formatEther(p.winnings)), 0);
    const totalSpent = participations.reduce((sum, p) => sum + parseFloat(ethers.formatEther(p.amount)), 0);
    const winRate = totalParticipations > 0 ? (totalWon / totalParticipations) * 100 : 0;
    const netProfit = totalWinnings - totalSpent;

    return {
      totalParticipations,
      totalWon,
      totalWinnings,
      totalSpent,
      winRate,
      netProfit,
    };
  }, [participations]);

  const getRecentParticipations = useCallback((limit: number = 10) => {
    return participations
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }, [participations]);

  const getWinningParticipations = useCallback(() => {
    return participations.filter(p => p.hasWon);
  }, [participations]);

  useEffect(() => {
    if (state.isConnected && state.account) {
      loadUserParticipations();
    }
  }, [state.isConnected, state.account, loadUserParticipations]);

  return {
    participations,
    loading,
    error,
    loadUserParticipations,
    getParticipationStats,
    getRecentParticipations,
    getWinningParticipations,
  };
};
