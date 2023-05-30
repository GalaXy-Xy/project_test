import React, { createContext, useContext, useReducer, ReactNode } from 'react'

interface AppState {
  selectedPool: string | null
  userStats: {
    totalParticipations: number
    totalWon: number
    totalRewards: string
    winRate: number
  }
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'info' | 'warning'
    message: string
    timestamp: number
  }>
}

type AppAction =
  | { type: 'SET_SELECTED_POOL'; payload: string | null }
  | { type: 'UPDATE_USER_STATS'; payload: Partial<AppState['userStats']> }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<AppState['notifications'][0], 'id' | 'timestamp'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }

const initialState: AppState = {
  selectedPool: null,
  userStats: {
    totalParticipations: 0,
    totalWon: 0,
    totalRewards: '0',
    winRate: 0
  },
  notifications: []
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SELECTED_POOL':
      return {
        ...state,
        selectedPool: action.payload
      }
    case 'UPDATE_USER_STATS':
      return {
        ...state,
        userStats: {
          ...state.userStats,
          ...action.payload
        }
      }
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            ...action.payload,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now()
          }
        ]
      }
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
      }
    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  setSelectedPool: (poolId: string | null) => void
  updateUserStats: (stats: Partial<AppState['userStats']>) => void
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const setSelectedPool = (poolId: string | null) => {
    dispatch({ type: 'SET_SELECTED_POOL', payload: poolId })
  }

  const updateUserStats = (stats: Partial<AppState['userStats']>) => {
    dispatch({ type: 'UPDATE_USER_STATS', payload: stats })
  }

  const addNotification = (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification })
  }

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
  }

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' })
  }

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        setSelectedPool,
        updateUserStats,
        addNotification,
        removeNotification,
        clearNotifications
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
