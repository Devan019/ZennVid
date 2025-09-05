'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ApiKeyGenerator from '@/components/openapi/apps/api-key-gen';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createNewApp, getApps, sendKey } from '@/lib/apiProvider';
import { useUser } from '@/context/UserProvider';

export default function CreateApp() {
  const [apps, setApps] = useState<Array<{ _id: string; appName: string; created_at: string }>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useUser();

  const mutation = useMutation({
    mutationFn: async (appname: string) => {
      try {
        const data = await createNewApp(appname)
        return data.DATA
      } catch (error) {
        console.log(error)
        return null
      }
    },
    onSuccess: ({ data }: { data: any }) => {
      console.log(data, "get it")
      if (data != null) {
        setApps(data.apps);
        return data.apiKey
      }
      return null
    },
    onError(error, variables, context) {
      console.error('Error generating API key:', error);

    },
  })

  const sendKeyMutation = useMutation({
    mutationFn: async (appId: string) => {
      try {
        const data = await sendKey({ appId })
        return data.DATA
      } catch (error) {
        console.log(error)
        return null
      }
    },
    onSuccess: ({ data }: { data: any }) => {
      if (data != null) {
        // alert("API key has been sent to your email!")
        return data.apiKey
      }
      return null
    },
    onError(error, variables, context) {
      console.error('Error sending API key:', error);
      // alert("Failed to send API key. Please try again.")
    },
  })


  const appQuery = useQuery({
    queryKey: ["app"],
    queryFn: async () => {
      const data = await getApps();
      const apis = data.DATA.apis;
      let tmp: any = [];
      apis.forEach((api: { apps: any[] }) => {
        tmp = tmp.concat(api.apps);
      });
      setApps(tmp);
      return apis;
    }
  })

  const handleGenerateApiKey = async (appname: string) => {
    try {
      const response = await mutation.mutateAsync(appname)
      console.log(response)
      if (response != null) {
        return { apiKey: '', success: false };
      }
      return { apiKey: response, success: true };
    } catch (error) {
      console.error('Error generating API key:', error);
      return { apiKey: '', success: false };
    }
  };

  const handleRequestApiKey = async (appId: string) => {
    try {
      sendKeyMutation.mutateAsync(appId)
    } catch (error) {
      console.error('Error requesting API key:', error);
      alert('Failed to send API key. Please try again.');
    }
  };

  useEffect(() => {
    async function main() {
      if (isAuthenticated) {
        await appQuery.refetch()
      }      
    }
    main()
  }, [isAuthenticated])

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create New App
        </h1>



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ApiKeyGenerator onGenerate={handleGenerateApiKey} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Apps
            </h3>

            {apps.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No apps created yet. Generate your first API key to get started!
              </p>
            ) : (
              <div className="space-y-3">
                {apps.map((app) => (
                  <div
                    key={app._id}
                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg flex"
                  >
                    <div className="flex items-center justify-between">
                      <div className='flex gap-4 items-center'>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {app.appName}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Created: {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRequestApiKey(app._id)}
                        className="text-sm ml-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded transition-colors"
                      >
                        Email API Key
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}