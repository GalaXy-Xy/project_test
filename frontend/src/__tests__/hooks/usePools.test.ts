import { renderHook, act } from '@testing-library/react';
import { usePools } from '@/hooks/usePools';
import { useApp } from '@/context/AppContext';

// Mock the context
jest.mock('@/context/AppContext');
const mockUseApp = useApp as jest.MockedFunction<typeof useApp>;

// Mock ethers
const mockProvider = {
  listAccounts: jest.fn(),
  getNetwork: jest.fn(),
  send: jest.fn(),
};

const mockContract = {
  getAllPools: jest.fn(),
  getPoolCount: jest.fn(),
  createPool: jest.fn(),
};

jest.mock('ethers', () => ({
  ethers: {
    BrowserProvider: jest.fn(() => mockProvider),
    Contract: jest.fn(() => mockContract),
    parseEther: jest.fn((value) => BigInt(Math.floor(parseFloat(value) * 1e18))),
    formatEther: jest.fn((value) => (Number(value) / 1e18).toFixed(4)),
  },
}));

// Mock window.ethereum
Object.defineProperty(window, 'ethereum', {
  value: {
    request: jest.fn(),
  },
  writable: true,
});

describe('usePools', () => {
  const mockDispatch = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseApp.mockReturnValue({
      state: {
        isConnected: true,
        account: '0x1234567890123456789012345678901234567890',
        chainId: 11155111,
        pools: [],
        userParticipations: [],
        loading: false,
        error: null,
      },
      dispatch: mockDispatch,
    });
  });

  it('should load pools when connected', async () => {
    const mockPools = ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'];
    mockContract.getAllPools.mockResolvedValue(mockPools);
    
    // Mock individual pool contracts
    const mockPoolContract = {
      getPoolInfo: jest.fn().mockResolvedValue([
        'Test Pool',
        '1000000000000000000', // 1 ETH
        '1', // winProbability
        '10', // winProbabilityDenominator
        '20', // platformFeePercentage
        '5', // totalParticipants
        '2000000000000000000', // totalWinnings
        '500000000000000000', // platformFees
        true, // isActive
      ]),
    };
    
    (require('ethers').ethers.Contract as jest.Mock).mockImplementation(() => mockPoolContract);

    const { result } = renderHook(() => usePools());

    await act(async () => {
      await result.current.loadPools();
    });

    expect(mockContract.getAllPools).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_POOLS',
      payload: expect.any(Array),
    });
  });

  it('should handle pool loading errors', async () => {
    mockContract.getAllPools.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => usePools());

    await act(async () => {
      await result.current.loadPools();
    });

    expect(result.current.error).toBe('Network error');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_ERROR',
      payload: 'Network error',
    });
  });

  it('should create pool successfully', async () => {
    const poolData = {
      name: 'Test Pool',
      minParticipation: '0.01',
      winProbability: '1',
      winProbabilityDenominator: '10',
      platformFeePercentage: '20',
      duration: '0',
    };
    const initialFunding = '0.1';
    
    const mockTx = { hash: '0x1234567890abcdef', wait: jest.fn().mockResolvedValue({}) };
    mockContract.createPool.mockResolvedValue(mockTx);

    const { result } = renderHook(() => usePools());

    let txHash: string;
    await act(async () => {
      txHash = await result.current.createPool(poolData, initialFunding);
    });

    expect(mockContract.createPool).toHaveBeenCalledWith(
      poolData.name,
      expect.any(BigInt), // minParticipation in wei
      poolData.winProbability,
      poolData.winProbabilityDenominator,
      poolData.platformFeePercentage,
      poolData.duration,
      { value: expect.any(BigInt) } // initialFunding in wei
    );
    expect(txHash).toBe('0x1234567890abcdef');
  });

  it('should handle pool creation errors', async () => {
    const poolData = {
      name: 'Test Pool',
      minParticipation: '0.01',
      winProbability: '1',
      winProbabilityDenominator: '10',
      platformFeePercentage: '20',
      duration: '0',
    };
    const initialFunding = '0.1';
    
    mockContract.createPool.mockRejectedValue(new Error('Insufficient funds'));

    const { result } = renderHook(() => usePools());

    await act(async () => {
      try {
        await result.current.createPool(poolData, initialFunding);
      } catch (error) {
        expect(error.message).toBe('Insufficient funds');
      }
    });

    expect(result.current.error).toBe('Insufficient funds');
  });

  it('should participate in pool successfully', async () => {
    const poolAddress = '0x1111111111111111111111111111111111111111';
    const amount = '0.01';
    
    const mockTx = { hash: '0xabcdef1234567890', wait: jest.fn().mockResolvedValue({}) };
    mockContract.participate.mockResolvedValue(mockTx);

    const { result } = renderHook(() => usePools());

    let txHash: string;
    await act(async () => {
      txHash = await result.current.participateInPool(poolAddress, amount);
    });

    expect(mockContract.participate).toHaveBeenCalledWith({
      value: expect.any(BigInt), // amount in wei
    });
    expect(txHash).toBe('0xabcdef1234567890');
  });

  it('should handle participation errors', async () => {
    const poolAddress = '0x1111111111111111111111111111111111111111';
    const amount = '0.01';
    
    mockContract.participate.mockRejectedValue(new Error('Insufficient balance'));

    const { result } = renderHook(() => usePools());

    await act(async () => {
      try {
        await result.current.participateInPool(poolAddress, amount);
      } catch (error) {
        expect(error.message).toBe('Insufficient balance');
      }
    });

    expect(result.current.error).toBe('Insufficient balance');
  });

  it('should not load pools when not connected', async () => {
    mockUseApp.mockReturnValue({
      state: {
        isConnected: false,
        account: null,
        chainId: null,
        pools: [],
        userParticipations: [],
        loading: false,
        error: null,
      },
      dispatch: mockDispatch,
    });

    const { result } = renderHook(() => usePools());

    await act(async () => {
      await result.current.loadPools();
    });

    expect(mockContract.getAllPools).not.toHaveBeenCalled();
  });
});
