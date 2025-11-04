"use client"
import Chart from '@/components/admin/Chart';
import MonthlyChart from '@/components/admin/monthlyChart';
import { StatsCard } from '@/components/admin/StatCard';
import { VideoStats } from '@/constants/admin_analisys';
import { ResponseData } from '@/constants/response';
import { changeDailyVideo, videostats, } from '@/lib/apiProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, VideoIcon, Videotape } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { GiMagicHat, GiTalk } from 'react-icons/gi';



const page = () => {
  const [videoStatsData, setVideoStatsData] = useState<VideoStats>();
  const [chartData, setChartData] = useState<any[]>([]);
  const [isMonthly, setIsMonthly] = useState(false);
  const [videoChartData, setVideoChartData] = useState<any[]>([]);


  const changeDailyVideoMutation = useMutation({
    mutationFn: async ({ date, state }: { date: Date; state: 'Prev' | 'Next' }) => {
      const response: ResponseData = await changeDailyVideo({ date, state });
      setChartData(response.DATA);
      return response;
    }
  })

  const changeDailyUserHelper = (date: Date, state: 'Prev' | 'Next') => {
    changeDailyVideoMutation.mutate({ date, state });
  }


  const VideoQuery = useQuery<ResponseData>({
    queryKey: ['videoQuery'],
    queryFn: videostats
  })

  const setDataViaMain = (data: any) => {
    setVideoStatsData(data)
    setChartData(data.dailyVideo ?? []);
  }

  async function main() {
    if (VideoQuery.data) {
      setDataViaMain(VideoQuery.data.DATA)
      return;
    }

    const query = await VideoQuery.refetch();
    setDataViaMain(query.data?.DATA)
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
              label={"Today's Videos"}
              value={videoStatsData?.todayVideos[0]?.count ?? 0}
              icon={<VideoIcon />}
            />
            <StatsCard
              label={"Total Videos"}
              value={videoStatsData?.totalVideos[0]?.totalVideos ?? 0}
              icon={<Videotape />}
            />
            <StatsCard
              label={"Magic Videos"}
              value={videoStatsData?.magicVideos[0]?.count ?? 0}
              icon={<GiMagicHat />}
            />
            <StatsCard
              label={"SadTalker Videos"}
              value={videoStatsData?.sadtalkerVideos[0]?.count ?? 0}
              icon={<GiTalk />}
            />

          </div>
        </div>

        {/** Chart Section - Component 2 */}
        <div className='border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 m-4  shadow-sm'>
          <h2 className='text-xl font-semibold mb-4'>Developer Chart</h2>
          <div className='flex gap-4 mb-4'>
            <button
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
              onClick={() => { changeChartData(videoStatsData?.dailyVideo ?? []); setIsMonthly(false) }}
            >
              Daily Users
            </button>
            <button
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
              onClick={() => { changeChartData(videoStatsData?.monthlyVideo ?? []); setIsMonthly(true) }}
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

        {/** All Videos and styles - Component 3 */}
        <div className='border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 m-4  shadow-sm'>
          <h2 className='text-xl font-semibold mb-4'>Videos Chart</h2>
          <div className='flex gap-4 mb-4'>
            <button
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
              onClick={() => { changeChartData(videoStatsData?.dailyVideo ?? []); setIsMonthly(false) }}
            >
              All Styles
            </button>
            <button
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
              onClick={() => { changeChartData(videoStatsData?.monthlyVideo ?? []); setIsMonthly(true) }}
            >
              7 Languages
            </button>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default page