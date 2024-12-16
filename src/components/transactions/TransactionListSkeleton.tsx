import React from 'react';

export const TransactionListSkeleton: React.FC = () => (
  <div className="bg-gray-900/50 rounded-lg p-4 backdrop-blur-sm">
    <div className="h-7 w-48 bg-gray-800 rounded animate-pulse mb-4"></div>
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse"></div>
            <div>
              <div className="h-4 w-24 bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-16 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="text-right">
            <div className="h-3 w-12 bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);