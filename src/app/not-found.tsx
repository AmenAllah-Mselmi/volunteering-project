"use client"
import Head from 'next/head';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="description" content="The page you're looking for doesn't exist" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div className="p-8">
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 mb-8">
                  <div className="absolute inset-0 bg-indigo-100 rounded-full opacity-20"></div>
                  <div className="absolute inset-8 flex items-center justify-center">
                    <svg
                      className="w-24 h-24 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                
                <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
                <p className="text-gray-500 text-center mb-8">
                  Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>
                
                <Link
                  href="/"
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Return Home
                </Link>
                
                <div className="mt-8 text-sm text-gray-400">
                  <p>Still having trouble? <a href="/contact" className="text-indigo-500 hover:underline">Contact us</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}