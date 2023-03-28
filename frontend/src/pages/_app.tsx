import type { AppProps } from 'next/app';
import { AppProvider } from '@/context/AppContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </ErrorBoundary>
  );
}
