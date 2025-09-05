'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEyeSlash } from 'react-icons/fa';
import { CheckIcon, ClipboardIcon, EyeIcon } from 'lucide-react';

interface ApiKeyGeneratorProps {
  onGenerate: (appname: string) => Promise<{ apiKey: string; success: boolean }>;
}

export default function ApiKeyGenerator({ onGenerate }: ApiKeyGeneratorProps) {
  const [appname, setAppname] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!appname.trim()) return;
    
    setLoading(true);
    try {
      const result = await onGenerate(appname);
      if (result.success) {
        setApiKey(result.apiKey);
        setShowApiKey(true);
      }
    } catch (error) {
      console.error('Failed to generate API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Generate API Key
      </h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="appname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            App name
          </label>
          <input
            type="text"
            id="appname"
            value={appname}
            onChange={(e) => setAppname(e.target.value)}
            placeholder="Enter your app name"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={!appname.trim() || loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {loading ? 'Generating...' : 'Generate API Key'}
        </motion.button>

        {apiKey && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md"
          >
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your API Key
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showApiKey ? (
                    <FaEyeSlash className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={copyToClipboard}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {copied ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ClipboardIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded border">
              {showApiKey ? apiKey : '•'.repeat(apiKey.length)}
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              ⚠️ This is the only time we'll show you this key. Store it securely!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}