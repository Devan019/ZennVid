"use client"
import Chart from '@/components/admin/Chart';
import MonthlyChart from '@/components/admin/monthlyChart';
import { StatsCard } from '@/components/admin/StatCard';
import {  DeveloperStats, UserStats } from '@/constants/admin_analisys';
import { ResponseData } from '@/constants/response';
import { changeDailyDeveloper, changeDailyRevenue, changeDailyUser, developerstats, userStats, } from '@/lib/apiProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import {  ChevronLeft, ChevronRight,  CodeIcon, UserCheck, UserCircle, UserIcon } from 'lucide-react';
import React, {  useEffect, useState } from 'react'
import { FaCode, FaGoogle } from 'react-icons/fa';
import { FaMoneyBillTransfer } from 'react-icons/fa6';
import {  TbApiApp, TbAppWindow, TbPassword } from 'react-icons/tb';
import { toast } from 'sonner';



const Page = () => {
  const [userStatsData, setUserStatsData] = useState<UserStats>();
  const [chartData, setChartData] = useState<any[]>([]);
  const [isMonthly, setIsMonthly] = useState(false);


  const changeDailyUserMutation = useMutation({
    mutationFn: async ({ date, state }: { date: Date; state: 'Prev' | 'Next' }) => {
      const response: ResponseData = await changeDailyUser({ date, state });
      toast.success(response.MESSAGE);
      setChartData(response.DATA);
      return response;
    }
  })

  const changeDailyUserHelper = (date: Date, state: 'Prev' | 'Next') => {
    changeDailyUserMutation.mutate({ date, state });
  }


  const UserQuery = useQuery<ResponseData>({
    queryKey: ['userQuery'],
    queryFn: userStats
  })

  const setDataViaMain = (data: any, message: string) => {
    toast.success(message);
    setUserStatsData(data)
    setChartData(data.dailyUsers ?? []);
  }

  async function main() {
    if (UserQuery.data) {
      setDataViaMain(UserQuery.data.DATA, UserQuery.data.MESSAGE);
      return;
    }

    const query = await UserQuery.refetch();
    setDataViaMain(query.data?.DATA, query.data?.MESSAGE ?? "");
  }

  const changeChartData = (data: any) => {
    setChartData(data);
  }
  useEffect(() => {
    main()
  }, [])


  return (
    <div className='ml-[25vw] mt-16'>
      <h1 className='pb-4 text-center'>User Stats</h1>
      <div>
        {/** Stats Section - Component 1 */}
        <div className='border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 m-4  shadow-sm'>
          <h2 className='text-xl font-semibold mb-4'>Statistics Overview</h2>
          <div className='flex justify-start items-center gap-4 flex-wrap'>
            <StatsCard
              label={"Total Credits"}
              value={userStatsData?.substats[0]?.credits ?? 0}
              icon={<FaMoneyBillTransfer />}
            />
            <StatsCard
              label={"Total Google Users"}
              value={userStatsData?.googleUsers[0]?.count ?? 0}
              icon={<FaGoogle />}
            />
            <StatsCard
              label={"Total Credential Users"}
              value={userStatsData?.credentialUsers[0]?.count ?? 0}
              icon={<TbPassword />}
            />
          </div>
        </div>

        {/** Chart Section - Component 2 */}
        <div className='border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 m-4  shadow-sm'>
          <h2 className='text-xl font-semibold mb-4'>User Chart</h2>
          <div className='flex gap-4 mb-4'>
            <button
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
              onClick={() => { changeChartData(userStatsData?.dailyUsers ?? []); setIsMonthly(false) }}
            >
              Daily Users
            </button>
            <button
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
              onClick={() => { changeChartData(userStatsData?.monthlyUsers ?? []); setIsMonthly(true) }}
            >
              Monthly Users
            </button>
          </div>

          {chartData?.length !== 0 && !isMonthly && (
            <div className='flex justify-center items-center'>
              <ChevronLeft
                onClick={
                  () => {
                    changeDailyUserHelper(new Date(chartData[0]._id), 'Prev')
                  }
                }
                className='inline-block mb-2 cursor-pointer'
              />

              <div className='flex justify-center items-center '>
                {chartData?.map((item: any) => (
                  <div
                    className='mx-4 text-sm border-b-2 border-transparent hover:border-blue-500 pb-1 cursor-pointer'
                    key={item._id}> {new Date(item?._id).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })} </div>
                ))}
              </div>

              <ChevronRight
                className='inline-block mb-2 cursor-pointer'
                onClick={
                  () => {
                    changeDailyUserHelper(new Date(chartData[chartData?.length - 1]?._id), 'Next')
                  }
                }
              />
            </div>
          )}

          {isMonthly ? (
            <MonthlyChart
            isAmount={false}
             data={chartData} />
          ) : (
            <Chart
            isAmount={false}
            data={chartData} XAxisKey="_id" />
          )}
        </div>

        
      </div>
    </div>
  )
}

export default Page