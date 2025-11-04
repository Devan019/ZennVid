import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { memo } from "react";

export const PaginationTable = memo((
  { columns, data, page, limit, total, totalPages, onPageChange, onLimitChange, searchTerm, onSearch, datePickerColumns, selectedDate, setSelectedDate }:
    {
      columns: ColumnDef<any>[];
      data: any[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      onPageChange: (page: number) => void;
      onLimitChange: (limit: number) => void;
      searchTerm: string;
      onSearch: (searchTerm: string) => void;
      datePickerColumns?: string[];
      selectedDate?: Date | undefined,
      setSelectedDate?: (date: Date | undefined) => void
    }
) => {

  return (
    <div className='m-4'>
      {/* table  */}
      <h2 className='mt-8 mb-4'>Recent Transactions</h2>
      <DataTable
        limit={limit}
        page={page}
        total={total}
        totalPages={totalPages}
        onLimitChange={onLimitChange}
        onPageChange={onPageChange}
        columns={columns}
        data={data}
        searchTerm={searchTerm}
        onSearch={onSearch}
        datePickerColumns={datePickerColumns}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  )
})