"use client"
import Chart from '@/components/admin/Chart';
import MonthlyChart from '@/components/admin/monthlyChart';
import { StatsCard } from '@/components/admin/StatCard';
import { DataTable } from '@/components/common/data-table';
import { PaginationTable } from '@/components/common/pagination-table';
import { Button } from '@/components/ui/button';
import { Transaction, TransactionStat } from '@/constants/admin_analisys';
import { ResponseData } from '@/constants/response';
import { changeDailyRevenue, getTransactionHistory, txStats } from '@/lib/apiProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { ChartBarIcon, ChevronLeft, ChevronRight, ClipboardEdit } from 'lucide-react';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FaMoneyBill, FaMoneyBillWave, FaSortAmountDown } from 'react-icons/fa';
import { GiCreditsCurrency, GiPayMoney } from 'react-icons/gi';
import { TbTransactionBitcoin } from 'react-icons/tb';



const page = () => {
  const [txStatsData, setTxStatsData] = useState<TransactionStat>();
  const [chartData, setChartData] = useState<any[]>([]);
  const [isMonthly, setIsMonthly] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const datePickerColumns = ["createdAt"];
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

 

  const txMutation = useMutation({
    mutationFn: async () => {
      const response: ResponseData = await getTransactionHistory({ page, limit, search, createdAt: selectedDate });
      const data = response.DATA;
      setTableData(data?.transactions.map((item: Transaction, index: number) => ({
        no: (page - 1) * limit + index + 1,
        payment_id: item.payment_id,
        amount: item.amount,
        credits_received: item.credits_received,
        createdAt: new Date(item.createdAt).toLocaleDateString(),
      })) ?? []);
      setTotal(data?.total ?? 0);
    }
  })

  const changeDailyRevenueMutation = useMutation({
    mutationFn: async ({ date, state }: { date: Date; state: 'Prev' | 'Next' }) => {
      const response: ResponseData = await changeDailyRevenue({ date, state });
      console.log(response);
      setChartData(response.DATA);
      return response;
    }
  })

  const changeDailyRevenueHelper = (date: Date, state: 'Prev' | 'Next') => {
    changeDailyRevenueMutation.mutate({ date, state });
  }

  const columns: ColumnDef<Transaction>[] = useMemo(() =>
    [
      {
        accessorKey: "no",
        header: "No.",
      },
      {
        accessorKey: "payment_id",
        header: "Payment ID",
      },
      {
        accessorKey: "amount",
        header: "Amount",
      },
      {
        accessorKey: "credits_received",
        header: "Credits Received",
      },
      {
        accessorKey: "createdAt",
        header: "Payment Date",
      }
    ], [])

  const txQuery = useQuery<ResponseData>({
    queryKey: ['txStats'],
    queryFn: txStats
  })

  const setDataViaMain = (data: any) => {
    setTxStatsData(data)
    setChartData(data.revenue?.dailyRevenue ?? [])
    setTableData(data.transactionHistory.transactions.map((item: Transaction, index: number) => ({
      no: index + 1,
      payment_id: item.payment_id,
      amount: item.amount,
      credits_received: item.credits_received,
      createdAt: new Date(item.createdAt).toLocaleDateString(),
    })) ?? []);
    setTotal(data.transactionHistory.total ?? 0);
  }

  async function main() {
    if (txQuery.data) {
      setDataViaMain(txQuery.data.DATA)
      return;
    }

    const query = await txQuery.refetch();
    setDataViaMain(query.data?.DATA)
  }

  const changeChartData = (data: any) => {
    setChartData(data);
  }
  useEffect(() => {
    main()
  }, [])

  const onPageChange = useCallback((newPage: number) => {
    // if( newPage < 1 || newPage > Math.ceil(total / limit)) return;
    setPage(newPage);
    txMutation.mutate();
  }, []);

  const onLimitChange = useCallback((newLimit: number | string) => {
    setPage(1);
    setLimit(Number(newLimit));
    txMutation.mutate();
  }, []);


  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = setTimeout(() => {
      txMutation.mutate();
    }, 500);
  };

   useEffect(() => {
    txMutation.mutate();
  }, [selectedDate]);

  return (
    <div className='ml-[25vw] mt-16'>
      <h1 className='pb-4 text-center'>Transaction Stats</h1>
      <div>
        {/** Stats Section - Component 1 */}
        <div className='border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 m-4  shadow-sm'>
          <h2 className='text-xl font-semibold mb-4'>Statistics Overview</h2>
          <div className='flex justify-start items-center gap-4 flex-wrap'>
            <StatsCard
              label={"Today Revenue"}
              value={txStatsData?.revenue?.todayRevenue[0]?.amount ?? 0}
              icon={<ChartBarIcon />}
            />
            <StatsCard
              label={"Total Amount"}
              value={txStatsData?.revenue?.substats[0]?.totalAmount ?? 0}
              icon={<FaMoneyBillWave />}
            />
            <StatsCard
              label={"Total Credit Received"}
              value={txStatsData?.revenue?.substats[0]?.totalCreditSend ?? 0}
              icon={<GiCreditsCurrency />}
            />
            <StatsCard
              label={"Total Transactions"}
              value={txStatsData?.revenue?.substats[0]?.totalTranscations ?? 0}
              icon={<TbTransactionBitcoin />}
            />
          </div>
        </div>

        {/** Chart Section - Component 2 */}
        <div className='border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 m-4  shadow-sm'>
          <h2 className='text-xl font-semibold mb-4'>Revenue Chart</h2>
          <div className='flex gap-4 mb-4'>
            <button
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
              onClick={() => { changeChartData(txStatsData?.revenue?.dailyRevenue ?? []); setIsMonthly(false) }}
            >
              Daily Revenue
            </button>
            <button
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
              onClick={() => { changeChartData(txStatsData?.revenue?.monthlyRevenue ?? []); setIsMonthly(true) }}
            >
              Monthly Revenue
            </button>
          </div>

          {chartData?.length !== 0 && !isMonthly && (
            <div className='flex justify-center items-center'>
              <ChevronLeft
                onClick={
                  () => {
                    changeDailyRevenueHelper(new Date(chartData[0]._id), 'Prev')
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
                    changeDailyRevenueHelper(new Date(chartData[chartData?.length - 1]?._id), 'Next')
                  }
                }
              />
            </div>
          )}

          {isMonthly ? (
            <MonthlyChart data={chartData} />
          ) : (
            <Chart data={chartData} XAxisKey="_id" />
          )}
        </div>

        {/** Transaction Table Section - Component 3 */}
        <div className='border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 m-4  shadow-sm'>
          <PaginationTable
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
            page={page}
            limit={limit}
            total={total}
            totalPages={Math.ceil(total / limit)}
            columns={columns}
            data={tableData}
            searchTerm={search}
            onSearch={handleSearch}
            datePickerColumns={datePickerColumns}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>

      </div>
    </div>
  )
}

export default page