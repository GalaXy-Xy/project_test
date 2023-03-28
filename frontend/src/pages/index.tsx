import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import WalletConnect from '@/components/WalletConnect';
import PoolCard from '@/components/PoolCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Notification from '@/components/Notification';
import { usePools } from '@/hooks/usePools';
import { PlusIcon, TrophyIcon, UsersIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const { state } = useApp();
  const { pools, loading, error } = usePools();
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
  } | null>(null);

  const handleParticipate = (poolId: string) => {
    if (!state.isConnected) {
      setNotification({
        type: 'warning',
        title: 'Wallet Not Connected',
        message: 'Please connect your wallet to participate in pools.',
      });
      return;
    }
    // Navigate to pool detail page for participation
    window.location.href = `/pools/${poolId}`;
  };

  const handleViewDetails = (poolId: string) => {
    window.location.href = `/pools/${poolId}`;
  };

  const activePools = pools.filter(pool => pool.isActive);
  const totalParticipants = pools.reduce((sum, pool) => sum + parseInt(pool.totalParticipants), 0);
  const totalWinnings = pools.reduce((sum, pool) => sum + parseFloat(pool.totalWinnings), 0);

  return (
    <>
      <Head>
        <title>Prize Pool DApp - Decentralized Lottery System</title>
        <meta name="description" content="Participate in decentralized prize pools on Ethereum Sepolia testnet with fair random number generation using Chainlink VRF." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <TrophyIcon className="h-8 w-8 text-primary-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">Prize Pool DApp</h1>
              </div>
              <WalletConnect />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">
                Decentralized Prize Pool Lottery
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Fair, transparent, and secure lottery system powered by Chainlink VRF
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/pools">
                  <button className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                    View All Pools
                  </button>
                </Link>
                {state.isConnected && (
                  <Link href="/create">
                    <button className="border border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                      Create Pool
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <TrophyIcon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{pools.length}</h3>
                <p className="text-gray-600">Total Pools</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <UsersIcon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{totalParticipants}</h3>
                <p className="text-gray-600">Total Participants</p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{totalWinnings.toFixed(4)}</h3>
                <p className="text-gray-600">Total Winnings (ETH)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Active Pools Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Active Pools</h2>
              <Link href="/pools">
                <button className="btn-outline">
                  View All Pools
                </button>
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" text="Loading pools..." />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Retry
                </button>
              </div>
            ) : activePools.length === 0 ? (
              <div className="text-center py-12">
                <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Pools</h3>
                <p className="text-gray-600 mb-6">Be the first to create a prize pool!</p>
                {state.isConnected && (
                  <Link href="/create">
                    <button className="btn-primary">
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Create Pool
                    </button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activePools.slice(0, 6).map((pool) => (
                  <PoolCard
                    key={pool.id}
                    pool={pool}
                    onParticipate={handleParticipate}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-gray-400">
                Built on Ethereum Sepolia Testnet with Chainlink VRF
              </p>
            </div>
          </div>
        </footer>

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
