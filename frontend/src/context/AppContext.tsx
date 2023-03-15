import React, { createContext, useContext, useReducer, ReactNode } from 'react';

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

interface UserParticipation {
  poolId: string;
  amount: string;
  timestamp: number;
  hasWon: boolean;
  winnings: string;
}

interface AppState {
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  pools: Pool[];
  userParticipations: UserParticipation[];
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_CONNECTION'; payload: { isConnected: boolean; account: string | null; chainId: number | null } }
  | { type: 'SET_POOLS'; payload: Pool[] }
  | { type: 'ADD_POOL'; payload: Pool }
  | { type: 'UPDATE_POOL'; payload: { id: string; updates: Partial<Pool> } }
  | { type: 'SET_USER_PARTICIPATIONS'; payload: UserParticipation[] }
  | { type: 'ADD_PARTICIPATION'; payload: UserParticipation }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

const initialState: AppState = {
  isConnected: false,
  account: null,
  chainId: null,
  pools: [],
  userParticipations: [],
  loading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CONNECTION':
      return {
        ...state,
        isConnected: action.payload.isConnected,
        account: action.payload.account,
        chainId: action.payload.chainId,
        error: null,
      };
    case 'SET_POOLS':
      return {
        ...state,
        pools: action.payload,
        loading: false,
      };
    case 'ADD_POOL':
      return {
        ...state,
        pools: [...state.pools, action.payload],
      };
    case 'UPDATE_POOL':
      return {
        ...state,
        pools: state.pools.map(pool =>
          pool.id === action.payload.id
            ? { ...pool, ...action.payload.updates }
            : pool
        ),
      };
    case 'SET_USER_PARTICIPATIONS':
      return {
        ...state,
        userParticipations: action.payload,
        loading: false,
      };
    case 'ADD_PARTICIPATION':
      return {
        ...state,
        userParticipations: [...state.userParticipations, action.payload],
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
