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
import useUIEffectsStore from "@/stores/useUIEffectsStore";
import calculator from "@/utils/calculator";

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
  const { isNewVariableTriggered, setIsNewVariableTriggered } =
    useUIEffectsStore();
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

  const handleNewVariableClick = () => {
    setIsNewVariableTriggered(true);
  };

  const handleNewVariableSubmit = (name: string) => {
    setNewVariables({ name });
    setIsNewVariableTriggered(false);
  };

  return (
    <div className="text-black flex flex-col h-full overflow-hidden p-5 mb-15">
      <table className=" max-w-1/4 h-full">
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
                {row.getVisibleCells().map((cell) => {
                  const isValueCell = cell.column.id === "value";
                  const isValueEmpty = !cell.getValue();
                  return (
                    <td
                      contentEditable
                      key={cell.id}
                      className="p-2 border-b border-black max-w-[400px] w-full overflow-hidden text-ellipsis"
                    >
                      {!isValueCell ? (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      ) : isValueEmpty ? (
                        <span className="text-gray-500">Enter Formula</span>
                      ) : (
                        calculator(String(cell.getValue()), variables)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          <tr className="border-b">
            {isNewVariableTriggered ? (
              <td className="p-2 shrink">
                <input
                  type="text"
                  placeholder="Enter variable name"
                  className="border rounded p-1 "
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleNewVariableSubmit(
                        (e.target as HTMLInputElement).value
                      );
                    }
                  }}
                />
              </td>
            ) : (
              <td
                role="button"
                className="p-2 cursor-pointer"
                onClick={handleNewVariableClick}
              >
                New variable
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
