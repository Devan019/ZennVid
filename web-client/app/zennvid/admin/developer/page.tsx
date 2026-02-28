"use client"
import Chart from '@/components/admin/Chart';
import MonthlyChart from '@/components/admin/monthlyChart';
import { StatsCard } from '@/components/admin/StatCard';
import {  DeveloperStats } from '@/constants/admin_analisys';
import { ResponseData } from '@/constants/response';
import { changeDailyDeveloper, developerstats, } from '@/lib/apiProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import {  ChevronLeft, ChevronRight,  CodeIcon } from 'lucide-react';
import React, {  useEffect, useState } from 'react'
import {  TbApiApp, TbAppWindow } from 'react-icons/tb';
import { toast } from 'sonner';



const Page = () => {
  const [developerStatsData, setDeveloperStatsData] = useState<DeveloperStats>();
  const [chartData, setChartData] = useState<{ _id: string | Date; [key: string]: any }[]>([]);
  const [isMonthly, setIsMonthly] = useState(false);


  const changeDailyDeveloperMutation = useMutation({
    mutationFn: async ({ date, state }: { date: Date; state: 'Prev' | 'Next' }) => {
      const response: ResponseData = await changeDailyDeveloper({ date, state });
      toast.success(response.MESSAGE);
      setChartData(response.DATA);
      return response;
    }
  })

  const changeDailyDeveloperHelper = (date: Date, state: 'Prev' | 'Next') => {
    changeDailyDeveloperMutation.mutate({ date, state });
  }


  const DeveloperQuery = useQuery<ResponseData>({
    queryKey: ['developerQuery'],
    queryFn: developerstats
  })

  const setDataViaMain = (data:DeveloperStats, message:string) => {
    setDeveloperStatsData(data)
    setChartData(data.dailyUsers ?? []);
    toast.success(message);
  }

  async function main() {
    if (DeveloperQuery.data) {
      setDataViaMain(DeveloperQuery.data.DATA, DeveloperQuery.data.MESSAGE)
      return;
    }

    const query = await DeveloperQuery.refetch();
    setDataViaMain(query.data?.DATA, query.data?.MESSAGE ?? "")
  }

  const changeChartData = (data:{[key: string]: any, _id : string| Date}[]) => {
    setChartData(data);
  }
  useEffect(() => {
    main()
  }, [])


  return (
    <div className='ml-[25vw] mt-16'>
      <h1 className='pb-4 text-center'>Developer Stats</h1>
      <div>
        {/** Stats Section - Component 1 */}
        <div className='border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 m-4  shadow-sm'>
          <h2 className='text-xl font-semibold mb-4'>Statistics Overview</h2>
          <div className='flex justify-start items-center gap-4 flex-wrap'>
            <StatsCard
              label={"Total Developers"}
              value={developerStatsData?.substats[0]?.developers ?? 0}
              icon={<CodeIcon />}
            />
            <StatsCard
              label={"Total Apps"}
              value={developerStatsData?.substats[0]?.apps ?? 0}
              icon={<TbAppWindow />}
            />
            <StatsCard
              label={"Total Api Calls"}
              value={developerStatsData?.substats[0]?.apiCalls ?? 0}
              icon={<TbApiApp />}
            />
          </div>
        </div>

        {/** Chart Section - Component 2 */}
        <div className='border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 m-4  shadow-sm'>
          <h2 className='text-xl font-semibold mb-4'>Developer Chart</h2>
          <div className='flex gap-4 mb-4'>
            <button
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
              onClick={() => { changeChartData(developerStatsData?.dailyUsers ?? []); setIsMonthly(false) }}
            >
              Daily Developers
            </button>
            <button
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
              onClick={() => { 
                setChartData((developerStatsData?.monthlyUsers ?? []).map((item: any) => ({ ...item, _id: `${item._id.year}-${String(item._id.month).padStart(2, '0')}` })));
                setIsMonthly(true);
              }}
            >
              Monthly Developers
            </button>
          </div>

          {chartData?.length !== 0 && !isMonthly && (
            <div className='flex justify-center items-center'>
              <ChevronLeft
                onClick={
                  () => {
                    changeDailyDeveloperHelper(new Date(chartData[0]._id), 'Prev')
                  }
                }
                className='inline-block mb-2 cursor-pointer'
              />

              <div className='flex justify-center items-center '>
                {chartData?.map((item) => (
                  <div
                    className='mx-4 text-sm border-b-2 border-transparent hover:border-blue-500 pb-1 cursor-pointer'
                    key={typeof item._id === 'string' ? item._id : item._id.toISOString()}> {new Date(item?._id).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })} </div>
                ))}
              </div>

              <ChevronRight
                className='inline-block mb-2 cursor-pointer'
                onClick={
                  () => {
                    changeDailyDeveloperHelper(new Date(chartData[chartData?.length - 1]?._id), 'Next')
                  }
                }
              />
            </div>
          )}

          {isMonthly ? (
            <MonthlyChart
            isAmount={false}
             data={chartData.map((item: any) => ({ ...item, amount: item.count ?? 0 }))} />
          ) : (
            <Chart
            isAmount={false}
            data={chartData.map((item: any) => ({ ...item, _id: typeof item._id === 'string' ? item._id : new Date(item._id).toISOString().split('T')[0], count: item.count ?? 0 }))} XAxisKey="_id" />
          )}
        </div>
      </div>
    </div>
  )
}

export default Page