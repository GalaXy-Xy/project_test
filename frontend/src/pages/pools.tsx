import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import WalletConnect from '@/components/WalletConnect';
import PoolCard from '@/components/PoolCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Notification from '@/components/Notification';
import { usePools } from '@/hooks/usePools';
import { 
  PlusIcon, 
  TrophyIcon, 
  FunnelIcon, 
  Bars3Icon,
  Squares2X2Icon 
} from '@heroicons/react/24/outline';

type SortOption = 'newest' | 'oldest' | 'participants' | 'winnings';
type FilterOption = 'all' | 'active' | 'ended';

export default function PoolsPage() {
  const { state } = useApp();
  const { pools, loading, error } = usePools();
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
    window.location.href = `/pools/${poolId}`;
  };

  const handleViewDetails = (poolId: string) => {
    window.location.href = `/pools/${poolId}`;
  };

  const filteredPools = pools.filter(pool => {
    switch (filterBy) {
      case 'active':
        return pool.isActive;
      case 'ended':
        return !pool.isActive;
      default:
        return true;
    }
  });

  const sortedPools = [...filteredPools].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return parseInt(b.id) - parseInt(a.id);
      case 'oldest':
        return parseInt(a.id) - parseInt(b.id);
      case 'participants':
        return parseInt(b.totalParticipants) - parseInt(a.totalParticipants);
      case 'winnings':
        return parseFloat(b.totalWinnings) - parseFloat(a.totalWinnings);
      default:
        return 0;
    }
  });

  return (
    <>
      <Head>
        <title>All Pools - Prize Pool DApp</title>
        <meta name="description" content="Browse all available prize pools and participate in decentralized lotteries." />
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

        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">All Pools</h1>
                <p className="text-gray-600 mt-2">
                  {filteredPools.length} pool{filteredPools.length !== 1 ? 's' : ''} found
                </p>
              </div>
              {state.isConnected && (
                <Link href="/create">
                  <button className="btn-primary">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Pool
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex flex-wrap items-center space-x-4">
                {/* Filter */}
                <div className="flex items-center space-x-2">
                  <FunnelIcon className="h-5 w-5 text-gray-500" />
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                    className="input-field w-auto"
                  >
                    <option value="all">All Pools</option>
                    <option value="active">Active Only</option>
                    <option value="ended">Ended Only</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="input-field w-auto"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="participants">Most Participants</option>
                    <option value="winnings">Highest Winnings</option>
                  </select>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">View:</span>
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <Squares2X2Icon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <Bars3Icon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pools Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          ) : sortedPools.length === 0 ? (
            <div className="text-center py-12">
              <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {filterBy === 'all' ? 'No Pools Found' : `No ${filterBy} Pools Found`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filterBy === 'all' 
                  ? 'There are no prize pools available at the moment.'
                  : `There are no ${filterBy} pools available.`
                }
              </p>
              {state.isConnected && (
                <Link href="/create">
                  <button className="btn-primary">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create First Pool
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {sortedPools.map((pool) => (
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
