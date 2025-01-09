import React from 'react'

function PricingFeatures() {
  return (
    <div className=" py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100">
            <span className="text-blue-500 text-2xl">$</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            No Hidden Costs
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Transparent pricing with no surprise fees
          </p>
        </div>
  
        {/* Card 2 */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-green-100">
            <span className="text-green-500 text-2xl">✓</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Cancel Anytime
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            No long-term commitments required
          </p>
        </div>
  
        {/* Card 3 */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-purple-100">
            <span className="text-purple-500 text-2xl">⚡</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            24/7 Support
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Get help whenever you need it
          </p>
        </div>
      </div>
    </div>
  </div>
  
  )
}

export default PricingFeatures