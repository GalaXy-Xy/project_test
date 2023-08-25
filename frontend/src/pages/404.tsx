import Head from 'next/head'
import Link from 'next/link'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | Prize Pool DApp</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
              Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or doesn't exist.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <Home className="h-5 w-5 mr-2" />
              Go Home
            </Link>

            <div className="flex gap-4 justify-center">
              <Link
                href="/pools"
                className="inline-flex items-center px-4 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                <Search className="h-4 w-4 mr-2" />
                Browse Pools
              </Link>

              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-700 font-medium transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </button>
            </div>
          </div>

          <div className="mt-12 text-sm text-gray-500">
            <p>If you think this is an error, please contact support.</p>
          </div>
        </div>
      </div>
    </>
  )
}
