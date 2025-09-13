'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';


interface ApiEndpoint {
  method: string;
  endpoint: string;
  description: string;
  credits: number;
  sampleRequest: any;
  sampleResponse: any;
}

interface ApiDocumentationProps {
  title: string;
  description: string;
  endpoints: ApiEndpoint[];
}

export default function ApiDocumentation({ title, description, endpoints }: ApiDocumentationProps) {
  const [expandedEndpoint, setExpandedEndpoint] = useState<number | null>(null);

  const headers = {
    "x-app-name": "YourAppName",
    "Authorization": "Bearer YOUR_API_KEY"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>

      <div className="space-y-4">
        {endpoints.map((endpoint, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <button
              onClick={() => setExpandedEndpoint(expandedEndpoint === index ? null : index)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs font-medium rounded ${endpoint.method === 'POST' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                  {endpoint.method}
                </span>
                <code className="text-sm font-mono text-gray-900 dark:text-gray-100">
                  {endpoint.endpoint}
                </code>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {endpoint.credits} credits per request
                </span>
                {expandedEndpoint === index ? (
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </button>

            {expandedEndpoint === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 pb-4"
              >
                <h2 className='text-md font-semibold text-gray-900 dark:text-white mb-2'>
                  {endpoint.endpoint}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {endpoint.description}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Sample Header
                      </h4>
                      <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                        <code>{JSON.stringify(headers, null, 2)}</code>
                      </pre>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Sample Request
                      </h4>
                      <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                        <code>{JSON.stringify(endpoint.sampleRequest, null, 2)}</code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Sample Response
                    </h4>
                    <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                      <code>{JSON.stringify(endpoint.sampleResponse, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}