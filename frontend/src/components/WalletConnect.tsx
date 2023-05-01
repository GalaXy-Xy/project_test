import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

interface WalletConnectProps {
  className?: string
}

export default function WalletConnect({ className = '' }: WalletConnectProps) {
  const { isConnected, address } = useAccount()

  return (
    <div className={className}>
      <ConnectButton />
      {isConnected && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
      )}
    </div>
  )
}
