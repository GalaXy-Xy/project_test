import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PoolCard from '@/components/PoolCard';

const mockPool = {
  id: '1',
  name: 'Test Pool',
  minParticipation: '1000000000000000000', // 1 ETH in wei
  winProbability: '1',
  winProbabilityDenominator: '10',
  platformFeePercentage: '20',
  totalParticipants: '5',
  totalWinnings: '2000000000000000000', // 2 ETH in wei
  platformFees: '500000000000000000', // 0.5 ETH in wei
  isActive: true,
  address: '0x1234567890123456789012345678901234567890',
};

const mockHandlers = {
  onParticipate: jest.fn(),
  onViewDetails: jest.fn(),
};

describe('PoolCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pool information correctly', () => {
    render(
      <PoolCard
        pool={mockPool}
        onParticipate={mockHandlers.onParticipate}
        onViewDetails={mockHandlers.onViewDetails}
      />
    );

    expect(screen.getByText('Test Pool')).toBeInTheDocument();
    expect(screen.getByText('Pool #1')).toBeInTheDocument();
    expect(screen.getByText('1.0000 ETH')).toBeInTheDocument(); // minParticipation
    expect(screen.getByText('10.0%')).toBeInTheDocument(); // win percentage
    expect(screen.getByText('5')).toBeInTheDocument(); // totalParticipants
    expect(screen.getByText('2.0000 ETH')).toBeInTheDocument(); // totalWinnings
    expect(screen.getByText('20%')).toBeInTheDocument(); // platformFeePercentage
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('calls onViewDetails when View Details button is clicked', () => {
    render(
      <PoolCard
        pool={mockPool}
        onParticipate={mockHandlers.onParticipate}
        onViewDetails={mockHandlers.onViewDetails}
      />
    );

    const viewDetailsButton = screen.getByText('View Details');
    fireEvent.click(viewDetailsButton);

    expect(mockHandlers.onViewDetails).toHaveBeenCalledWith('1');
  });

  it('calls onParticipate when Participate button is clicked', () => {
    render(
      <PoolCard
        pool={mockPool}
        onParticipate={mockHandlers.onParticipate}
        onViewDetails={mockHandlers.onViewDetails}
      />
    );

    const participateButton = screen.getByText('Participate');
    fireEvent.click(participateButton);

    expect(mockHandlers.onParticipate).toHaveBeenCalledWith('1');
  });

  it('does not show Participate button for inactive pools', () => {
    const inactivePool = { ...mockPool, isActive: false };
    
    render(
      <PoolCard
        pool={inactivePool}
        onParticipate={mockHandlers.onParticipate}
        onViewDetails={mockHandlers.onViewDetails}
      />
    );

    expect(screen.queryByText('Participate')).not.toBeInTheDocument();
    expect(screen.getByText('Ended')).toBeInTheDocument();
  });

  it('handles unnamed pools correctly', () => {
    const unnamedPool = { ...mockPool, name: '' };
    
    render(
      <PoolCard
        pool={unnamedPool}
        onParticipate={mockHandlers.onParticipate}
        onViewDetails={mockHandlers.onViewDetails}
      />
    );

    expect(screen.getByText('Unnamed Pool')).toBeInTheDocument();
  });

  it('calculates win percentage correctly', () => {
    const poolWithDifferentProbability = {
      ...mockPool,
      winProbability: '3',
      winProbabilityDenominator: '20',
    };
    
    render(
      <PoolCard
        pool={poolWithDifferentProbability}
        onParticipate={mockHandlers.onParticipate}
        onViewDetails={mockHandlers.onViewDetails}
      />
    );

    expect(screen.getByText('15.0%')).toBeInTheDocument();
  });
});
