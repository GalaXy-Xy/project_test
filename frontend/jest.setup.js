import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock Next.js Head component
jest.mock('next/head', () => {
  return function Head({ children }) {
    return <>{children}</>;
  };
});

// Mock window.ethereum
Object.defineProperty(window, 'ethereum', {
  value: {
    isMetaMask: true,
    request: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
  },
  writable: true,
});

// Mock ethers
jest.mock('ethers', () => ({
  ethers: {
    BrowserProvider: jest.fn(),
    Contract: jest.fn(),
    parseEther: jest.fn((value) => BigInt(Math.floor(parseFloat(value) * 1e18))),
    formatEther: jest.fn((value) => (Number(value) / 1e18).toFixed(4)),
    isAddress: jest.fn((address) => /^0x[a-fA-F0-9]{40}$/.test(address)),
  },
}));

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    getEntriesByType: jest.fn(() => []),
  },
  writable: true,
});

// Suppress console warnings in tests
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});
