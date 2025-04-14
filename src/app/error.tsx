// components/errors/ServerError.tsx
"use client"
import Link from 'next/link';
import { FiServer } from 'react-icons/fi';

export default function ServerError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 p-4 bg-blue-100 rounded-full">
                <FiServer className="w-12 h-12 text-blue-600" />
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-3">500</h1>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Server Error</h2>
              <p className="text-gray-600 mb-6">
                Oops! Something went wrong on our end. We're working to fix it.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Link
                  href="/"
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 text-center"
                >
                  Home Page
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-all duration-300"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}