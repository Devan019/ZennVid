'use client';

import { FRONTEND_ROUTES } from '@/constants/frontend_routes';
import { useUser } from '@/context/UserProvider';
import { Stats } from '@/lib/apiProvider';
import { useQuery } from '@tanstack/react-query';
import { motion, number } from 'framer-motion';
import { BookAIcon, Languages, Speaker } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TbPhoto } from 'react-icons/tb';
import { toast } from 'sonner';




const apis = [
  {
    name: 'Caption Generator',
    description: 'Generate captions for videos and images',
    icon: BookAIcon,
    href: FRONTEND_ROUTES.CAPTION,
    color: 'bg-blue-500',
  },
  {
    name: 'Text Translator',
    description: 'Translate text between multiple languages',
    icon: Languages,
    href: FRONTEND_ROUTES.TRANSLATE,
    color: 'bg-green-500',
  },
  // {
  //   name: 'Image Generator',
  //   description: 'Generate images from text descriptions',
  //   icon: TbPhoto,
  //   href: '/apis/image-generator',
  //   color: 'bg-purple-500',
  // },
  {
    name: 'Text to Audio',
    description: 'Convert text to natural-sounding speech',
    icon: Speaker,
    href: FRONTEND_ROUTES.TEXT_AUDIO,
    color: 'bg-orange-500',
  },
];


interface Stats {
  name : string,
  value : number
}

export default function Dashboard() {

  const [stats, setStats] = useState<Stats[] | null>(null)
  const { isAuthenticated} = useUser()

  const query = useQuery({
    queryKey: ["query"],
    queryFn: async()=>{
      const data = await Stats()
      if(!data.SUCCESS){
        toast.error(data.MESSAGE);
        return;
      }
      toast.success(data.MESSAGE);
      return data
    }
  })

  async function setQuery() {
    let api = await query.data;
    if(!api){
      api = (await query.refetch()).data
    }

    let sts:Stats[] = []
    Object.entries(api.DATA).forEach((data) => {
      sts.push({
        name : data[0],
        value : Number(data[1]) ?? 0
      })
    })
    setStats(sts)
  }

  useEffect(() => {
    if(isAuthenticated && !stats){ 
      setQuery()
    }
  }, [isAuthenticated])

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <Link
            href={FRONTEND_ROUTES.APPS}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Create New App
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats?.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Available APIs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {apis.map((api, index) => (
            <motion.div
              key={api.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Link
                href={api.href}
                className="block p-4 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${api.color}`}>
                    <api.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {api.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {api.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}