"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useGetTableData } from "@/hooks";
import { TableDataItem } from "@/hooks/useGetTableData";
import useVariablesStore from "@/stores/useVariablesStore";
import { useEffect } from "react";

const columnHelper = createColumnHelper<TableDataItem>();
const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("value", {
    header: "Value",
    cell: (info) => info.getValue(),
  }),
];

export default function Home() {
  const { variables, setInitialVariables, setNewVariables } =
    useVariablesStore();
  const { data, isLoading, isSuccess } = useGetTableData();

  useEffect(() => {
    if (isSuccess && data) {
      setInitialVariables(data);
    }
  }, [isSuccess, data, setInitialVariables]);

  const table = useReactTable({
    data: variables || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleNewVariableClick = (name: string) => {
    console.log("New variable clicked");
    setNewVariables(name);
  };
  return (
    <div className="text-black flex flex-col h-full overflow-hidden p-5 mb-15">
      <table className=" max-w-1/2 h-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-2 border-b">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={columns.length} className="p-2 text-center">
                Loading...
              </td>
            </tr>
          )}
          {isSuccess &&
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2 border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          <tr className="border-b">
            <td
              role="button"
              className="p-2 cursor-pointer"
              onClick={() => handleNewVariableClick("test variable")}
            >
              New variable
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
