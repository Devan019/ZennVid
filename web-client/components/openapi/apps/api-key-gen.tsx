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
      setAppname("")
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

      </div>
    </motion.div>
  );
}