import React from 'react';
import { ethers } from 'ethers';
import { formatDistanceToNow } from 'date-fns';

interface Pool {
  id: string;
  name: string;
  minParticipation: string;
  winProbability: string;
  winProbabilityDenominator: string;
  platformFeePercentage: string;
  totalParticipants: string;
  totalWinnings: string;
  platformFees: string;
  isActive: boolean;
  address: string;
}

interface PoolCardProps {
  pool: Pool;
  onParticipate: (poolId: string) => void;
  onViewDetails: (poolId: string) => void;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, onParticipate, onViewDetails }) => {
  const formatEther = (wei: string) => {
    try {
      return parseFloat(ethers.formatEther(wei)).toFixed(4);
    } catch {
      return '0.0000';
    }
  };

  const winPercentage = (parseFloat(pool.winProbability) / parseFloat(pool.winProbabilityDenominator)) * 100;

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {pool.name || 'Unnamed Pool'}
          </h3>
          <p className="text-sm text-gray-500">
            Pool #{pool.id}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          pool.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {pool.isActive ? 'Active' : 'Ended'}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Min Participation</p>
            <p className="font-semibold">{formatEther(pool.minParticipation)} ETH</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Win Probability</p>
            <p className="font-semibold">{winPercentage.toFixed(1)}%</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Participants</p>
            <p className="font-semibold">{pool.totalParticipants}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Winnings</p>
            <p className="font-semibold">{formatEther(pool.totalWinnings)} ETH</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">Platform Fee</p>
          <p className="font-semibold">{pool.platformFeePercentage}%</p>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => onViewDetails(pool.id)}
          className="btn-outline flex-1"
        >
          View Details
        </button>
        {pool.isActive && (
          <button
            onClick={() => onParticipate(pool.id)}
            className="btn-primary flex-1"
          >
            Participate
          </button>
        )}
      </div>
    </div>
  );
};

export default PoolCard;
