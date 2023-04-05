import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useApp } from '@/context/AppContext';
import WalletConnect from '@/components/WalletConnect';
import LoadingSpinner from '@/components/LoadingSpinner';
import Notification from '@/components/Notification';
import { usePools } from '@/hooks/usePools';
import { useParticipation } from '@/hooks/useParticipation';
import { formatEther, formatAddress, getExplorerUrl } from '@/utils/contracts';
import { validateParticipation } from '@/utils/validation';
import { 
  TrophyIcon, 
  ArrowLeftIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function PoolDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { state } = useApp();
  const { pools, participateInPool, loading } = usePools();
  const { participations, getParticipationStats } = useParticipation();
  const [pool, setPool] = useState<any>(null);
  const [participationAmount, setParticipationAmount] = useState('');
  const [isParticipating, setIsParticipating] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
  } | null>(null);

  useEffect(() => {
    if (id && pools.length > 0) {
      const foundPool = pools.find(p => p.id === id);
      if (foundPool) {
        setPool(foundPool);
      } else {
        setNotification({
          type: 'error',
          title: 'Pool Not Found',
          message: 'The requested pool does not exist.',
        });
      }
    }
  }, [id, pools]);

  const handleParticipate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.isConnected) {
      setNotification({
        type: 'warning',
        title: 'Wallet Not Connected',
        message: 'Please connect your wallet to participate.',
      });
      return;
    }

    if (!pool) return;

    // Validate participation amount
    const validation = validateParticipation(participationAmount, pool.minParticipation);
    if (!validation.isValid) {
      setNotification({
        type: 'error',
        title: 'Invalid Amount',
        message: validation.error,
      });
      return;
    }

    setIsParticipating(true);
    setNotification(null);

    try {
      const txHash = await participateInPool(pool.address, participationAmount);
      
      setNotification({
        type: 'success',
        title: 'Participation Successful!',
        message: `Transaction hash: ${txHash}`,
      });

      setParticipationAmount('');
    } catch (error: any) {
      setNotification({
        type: 'error',
        title: 'Participation Failed',
        message: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsParticipating(false);
    }
  };

  const stats = getParticipationStats();
  const winPercentage = pool ? (parseFloat(pool.winProbability) / parseFloat(pool.winProbabilityDenominator)) * 100 : 0;

  if (!pool && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pool Not Found</h1>
          <p className="text-gray-600 mb-6">The requested pool does not exist.</p>
          <Link href="/pools">
            <button className="btn-primary">Back to Pools</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{pool?.name || 'Pool Details'} - Prize Pool DApp</title>
        <meta name="description" content="View pool details and participate in the decentralized lottery." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <TrophyIcon className="h-8 w-8 text-primary-600 mr-3" />
                  <h1 className="text-xl font-bold text-gray-900">Prize Pool DApp</h1>
                </Link>
              </div>
              <WalletConnect />
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading pool details..." />
          </div>
        ) : pool ? (
          <>
            {/* Pool Header */}
            <div className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center mb-4">
                  <Link href="/pools" className="mr-4">
                    <ArrowLeftIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                  </Link>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {pool.name || 'Unnamed Pool'}
                    </h1>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        pool.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {pool.isActive ? 'Active' : 'Ended'}
                      </span>
                      <span className="text-sm text-gray-500">
                        Pool #{pool.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pool Information */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Pool Stats */}
                  <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Pool Statistics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <UsersIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{pool.totalParticipants}</p>
                        <p className="text-sm text-gray-500">Participants</p>
                      </div>
                      <div className="text-center">
                        <CurrencyDollarIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{formatEther(pool.totalWinnings)}</p>
                        <p className="text-sm text-gray-500">Total Winnings</p>
                      </div>
                      <div className="text-center">
                        <TrophyIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{winPercentage.toFixed(1)}%</p>
                        <p className="text-sm text-gray-500">Win Rate</p>
                      </div>
                      <div className="text-center">
                        <ClockIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{pool.platformFeePercentage}%</p>
                        <p className="text-sm text-gray-500">Platform Fee</p>
                      </div>
                    </div>
                  </div>

                  {/* Pool Rules */}
                  <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Pool Rules</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Minimum Participation:</span>
                        <span className="font-medium">{formatEther(pool.minParticipation)} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Win Probability:</span>
                        <span className="font-medium">
                          {pool.winProbability} in {pool.winProbabilityDenominator} ({winPercentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Platform Fee:</span>
                        <span className="font-medium">{pool.platformFeePercentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pool Address:</span>
                        <a
                          href={getExplorerUrl(pool.address, 'sepolia')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary-600 hover:text-primary-700"
                        >
                          {formatAddress(pool.address)}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* User Participation History */}
                  {state.isConnected && participations.length > 0 && (
                    <div className="card">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Participation History</h2>
                      <div className="space-y-3">
                        {participations
                          .filter(p => p.poolId === pool.address)
                          .map((participation, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                {participation.hasWon ? (
                                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                                ) : (
                                  <XCircleIcon className="h-5 w-5 text-red-600 mr-3" />
                                )}
                                <div>
                                  <p className="font-medium">
                                    {participation.hasWon ? 'Won' : 'Lost'} - {formatEther(participation.amount)} ETH
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(participation.timestamp * 1000).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              {participation.hasWon && (
                                <span className="text-green-600 font-medium">
                                  +{formatEther(participation.winnings)} ETH
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Participation Form */}
                <div className="space-y-6">
                  {pool.isActive ? (
                    <div className="card">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Participate</h2>
                      <form onSubmit={handleParticipate} className="space-y-4">
                        <div>
                          <label htmlFor="amount" className="label">
                            Participation Amount (ETH)
                          </label>
                          <input
                            type="number"
                            id="amount"
                            value={participationAmount}
                            onChange={(e) => setParticipationAmount(e.target.value)}
                            className="input-field"
                            placeholder={formatEther(pool.minParticipation)}
                            step="0.001"
                            min={formatEther(pool.minParticipation)}
                            required
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Minimum: {formatEther(pool.minParticipation)} ETH
                          </p>
                        </div>

                        <button
                          type="submit"
                          disabled={isParticipating || !state.isConnected}
                          className="btn-primary w-full"
                        >
                          {isParticipating ? (
                            <div className="flex items-center justify-center">
                              <LoadingSpinner size="sm" />
                              <span className="ml-2">Participating...</span>
                            </div>
                          ) : (
                            'Participate Now'
                          )}
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="card">
                      <div className="text-center">
                        <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Pool Ended</h3>
                        <p className="text-gray-600">
                          This pool is no longer accepting new participants.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Pool Info */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pool Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm text-gray-600">
                          Powered by Chainlink VRF for fair randomness
                        </span>
                      </div>
                      <div className="flex items-center">
                        <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm text-gray-600">
                          Built on Ethereum Sepolia Testnet
                        </span>
                      </div>
                      <div className="flex items-center">
                        <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm text-gray-600">
                          Results are verifiable on-chain
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {/* Notification */}
        {notification && (
          <Notification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </>
  );
}
