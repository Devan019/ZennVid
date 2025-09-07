'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ApiKeyGenerator from '@/components/openapi/apps/api-key-gen';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createNewApp, getApps, sendKey } from '@/lib/apiProvider';
import { useUser } from '@/context/UserProvider';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CreateApp() {
  const [apps, setApps] = useState<Array<{ _id: string; appName: string; created_at: string }>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useUser();
  const [appStaus, setAppStaus] = useState(false)
  const [app, setApp] = useState<{ _id: string; appName: string; created_at: string }>();
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [updateId, setUpdateId] = useState<string | null>(null)
  const [newName, setNewName] = useState("")

  const createAppMutation = useMutation({
    mutationFn: async (appname: string) => {
      try {
        const data = await createNewApp(appname)
        return data
      } catch (error) {
        console.log(error)
        return null
      }
    },
    onSuccess: (data: { DATA: any }) => {
      if (data != null) {
        return data.DATA
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
      const response = await createAppMutation.mutateAsync(appname)
      if (response != null) {
        setApps((prev) => [...prev, { ...response.DATA }])
        setApp({ ...response.DATA })
        setIsOpen(true)
        
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

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-md rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                App Created Successfully 🎉
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Your API key has been securely sent to your email:{" "}
                <span className="font-medium text-blue-600 dark:text-blue-400">{user?.email}</span>
              </p>

              {app && (
                <div className="">
                  <p className="text-sm text-gray-500 dark:text-gray-400">App Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{app.appName}</p>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">App ID</p>
                  <p className="font-mono text-sm text-gray-800 dark:text-gray-200">{app._id}</p>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Created At</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(app.created_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

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
                {apps.map((app: any) => (
                  <div
                    key={app._id}
                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg flex justify-between items-center"
                  >
                    <div className="flex gap-4 items-center">
                      <h4 className="font-medium text-gray-900 dark:text-white">{app.appName}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Created: {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRequestApiKey(app._id)}
                      >
                        Email API Key
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setUpdateId(app._id)
                          setNewName(app.appName)
                        }}
                      >
                        Update
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setDeleteId(app._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Delete Dialog */}
                <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                  <DialogContent className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900 dark:text-white">Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-600 dark:text-gray-300">
                      Are you sure you want to delete this app? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 mt-4">
                      <Button variant="outline" onClick={() => setDeleteId(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          // if (deleteId) await deleteApp(deleteId)
                          setDeleteId(null)
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Update Dialog */}
                <Dialog open={!!updateId} onOpenChange={() => setUpdateId(null)}>
                  <DialogContent className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900 dark:text-white">Update App Name</DialogTitle>
                    </DialogHeader>
                    <Input
                      value={newName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
                      placeholder="Enter new app name"
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                    <div className="flex justify-end gap-3 mt-4">
                      <Button variant="outline" onClick={() => setUpdateId(null)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={async () => {
                          if (updateId && newName.trim()) {
                            // await updateApp(updateId, newName.trim())
                          }
                          setUpdateId(null)
                        }}
                      >
                        Update
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}