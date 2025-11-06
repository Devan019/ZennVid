"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { DatePicker } from "./date-picker";

export function DataTable({
  columns,
  data,
  isPagination = true,
  limit,
  page,
  total,
  onPageChange,
  onLimitChange,
  totalPages,
  onSearch,
  searchTerm = "",
  datePickerColumns,
  selectedDate,
  setSelectedDate,
  isAction,
  ActionNode
}: {
  columns: ColumnDef<any>[];
  data: any[];
  isPagination?: boolean;
  limit?: number;
  page?: number;
  total?: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  totalPages?: number;
  onSearch?: (searchTerm: string) => void;
  searchTerm?: string;
  datePickerColumns?: string[];
  selectedDate?: Date | undefined;
  setSelectedDate?: (date: Date | undefined) => void;
  isAction?: boolean;
  ActionNode?: React.ReactNode;
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilter(value);
    if (onSearch) onSearch(value);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  useEffect(() => {
    setGlobalFilter(searchTerm);
  }, [searchTerm]);

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="relative w-full max-w-sm">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={handleSearchChange}
          className="
            pl-4 pr-10 h-10 rounded-lg 
            border-gray-300 dark:border-gray-700 
            bg-white dark:bg-gray-900 
            text-gray-900 dark:text-gray-200 
            placeholder-gray-400 dark:placeholder-gray-500 
            shadow-sm focus:ring-2 focus:ring-blue-500 
            transition-all duration-200
          "
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </span>
      </div>

      {isAction && ActionNode}

      {/* Table Container */}
      <div className="
        rounded-xl border border-gray-200 dark:border-gray-800 
        shadow-lg bg-white dark:bg-gray-900 
        transition-colors duration-200 overflow-hidden
      ">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="
                    bg-gray-50 dark:bg-gray-800
                    border-b border-gray-200 dark:border-gray-700
                  "
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="
                        font-semibold 
                        text-gray-700 dark:text-gray-200 
                        text-sm py-4 px-4 
                        whitespace-nowrap
                      "
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                      {datePickerColumns?.includes(header.column.id) && (
                        <div className="mt-2">
                          <DatePicker
                            date={selectedDate}
                            setDate={(date) => setSelectedDate?.(date)}
                          />
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`
                      transition-colors duration-150
                     
                      ${index % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50 dark:bg-gray-900"}
                    `}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-4 px-4 text-gray-700 dark:text-gray-300"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <Search className="h-10 w-10 mb-3 opacity-30" />
                      <p className="text-sm font-medium">No results found</p>
                      <p className="text-xs mt-1">Try adjusting your search</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {isPagination && (
          <div className="
            flex flex-col sm:flex-row items-center justify-between 
            gap-4 px-6 py-4 
            bg-gray-50 dark:bg-gray-800 
            border-t border-gray-200 dark:border-gray-700
          ">
            {/* Rows per page */}
            <div className="flex items-center space-x-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Rows per page
              </p>
              <Select
                value={`${limit}`}
                onValueChange={(value) => onLimitChange?.(Number(value))}
              >
                <SelectTrigger className="h-9 w-[75px] rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 shadow-sm">
                  <SelectValue placeholder={`${limit}`} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                  {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                    <SelectItem
                      key={pageSize}
                      value={`${pageSize}`}
                      className="cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Page info */}
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              Page <span className="font-bold text-blue-600 dark:text-blue-400">{page}</span> of{" "}
              <span className="font-bold">{totalPages}</span>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="hidden lg:flex h-9 w-9 rounded-lg dark:bg-gray-900"
                onClick={() => onPageChange(1)}
                disabled={page === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg dark:bg-gray-900"
                onClick={() => onPageChange(Number(page) - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg dark:bg-gray-900"
                onClick={() => onPageChange(Number(page) + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="hidden lg:flex h-9 w-9 rounded-lg dark:bg-gray-900"
                onClick={() => onPageChange(totalPages ?? 1)}
                disabled={page === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
