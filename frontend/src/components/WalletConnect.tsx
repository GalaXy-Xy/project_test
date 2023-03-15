import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useApp } from '@/context/AppContext';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const WalletConnect: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const network = await provider.getNetwork();
          dispatch({
            type: 'SET_CONNECTION',
            payload: {
              isConnected: true,
              account: accounts[0].address,
              chainId: Number(network.chainId),
            },
          });
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      dispatch({
        type: 'SET_ERROR',
        payload: 'MetaMask is not installed. Please install MetaMask to continue.',
      });
      return;
    }

    setIsConnecting(true);
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();

      // Check if connected to Sepolia testnet
      if (Number(network.chainId) !== 11155111) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia testnet
          });
        } catch (switchError: any) {
          // If the chain doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0xaa36a7',
                  chainName: 'Sepolia Test Network',
                  rpcUrls: ['https://sepolia.infura.io/v3/YOUR_INFURA_KEY'],
                  nativeCurrency: {
                    name: 'SepoliaETH',
                    symbol: 'SepoliaETH',
                    decimals: 18,
                  },
                  blockExplorerUrls: ['https://sepolia.etherscan.io'],
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      }

      dispatch({
        type: 'SET_CONNECTION',
        payload: {
          isConnected: true,
          account: accounts[0],
          chainId: Number(network.chainId),
        },
      });
    } catch (error: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.message || 'Failed to connect wallet',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    dispatch({
      type: 'SET_CONNECTION',
      payload: {
        isConnected: false,
        account: null,
        chainId: null,
      },
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (state.isConnected && state.account) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          <div className="font-medium">{formatAddress(state.account)}</div>
          <div className="text-xs">Sepolia Testnet</div>
        </div>
        <button
          onClick={disconnectWallet}
          className="btn-outline text-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className="btn-primary"
    >
      {isConnecting ? (
        <div className="flex items-center space-x-2">
          <div className="spinner"></div>
          <span>Connecting...</span>
        </div>
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
};

export default WalletConnect;
