import { render, screen } from '@testing-library/react'
import PoolCard from '../../components/PoolCard'

const mockPool = {
  id: '1',
  name: 'Test Pool',
  minParticipation: '0.01',
  winProbability: 10,
  totalBalance: '2.5',
  participants: 45,
  isActive: true,
  endTime: Date.now() + 7 * 24 * 60 * 60 * 1000
}

describe('PoolCard', () => {
  it('renders pool information correctly', () => {
    render(<PoolCard pool={mockPool} />)
    
    expect(screen.getByText('Test Pool')).toBeInTheDocument()
    expect(screen.getByText('2.5 ETH')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
    expect(screen.getByText('10%')).toBeInTheDocument()
    expect(screen.getByText('0.01 ETH')).toBeInTheDocument()
  })

  it('shows active status for active pools', () => {
    render(<PoolCard pool={mockPool} />)
    
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('shows ended status for inactive pools', () => {
    const inactivePool = { ...mockPool, isActive: false }
    render(<PoolCard pool={inactivePool} />)
    
    expect(screen.getByText('Ended')).toBeInTheDocument()
  })

  it('displays time remaining correctly', () => {
    render(<PoolCard pool={mockPool} />)
    
    // Should show days and hours
    expect(screen.getByText(/d/)).toBeInTheDocument()
  })

  it('has working view details button', () => {
    render(<PoolCard pool={mockPool} />)
    
    const viewDetailsButton = screen.getByText('View Details')
    expect(viewDetailsButton).toBeInTheDocument()
    expect(viewDetailsButton.closest('a')).toHaveAttribute('href', '/pools/1')
  })
})
