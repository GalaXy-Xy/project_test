import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Decentralized Prize Pool Lottery System on Sepolia Testnet" />
        <meta name="keywords" content="dapp, lottery, ethereum, sepolia, chainlink, vrf, defi" />
        <meta name="author" content="GalaXy Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Prize Pool DApp - Decentralized Lottery System" />
        <meta property="og:description" content="Participate in fair, transparent prize pools powered by Chainlink VRF on Sepolia testnet" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://prize-pool-dapp.vercel.app" />
        <meta property="og:image" content="/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Prize Pool DApp - Decentralized Lottery System" />
        <meta name="twitter:description" content="Participate in fair, transparent prize pools powered by Chainlink VRF on Sepolia testnet" />
        <meta name="twitter:image" content="/og-image.png" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
