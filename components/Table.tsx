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
import { FocusEvent, KeyboardEvent, useEffect } from "react";
import useUIEffectsStore from "@/stores/useUIEffectsStore";
import calculator from "@/utils/calculator";

const columnHelper = createColumnHelper<
  TableDataItem & {
    result?: string;
  }
>();
const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("value", {
    header: "Value",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("result", {
    header: "result",
    cell: (info) => info.getValue(),
  }),
];

const Table = () => {
  const { variables, setInitialVariables, setNewVariables, updatedVariable } =
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

  const handleUpdatedVariable = ({
    name,
    value,
    e,
  }: {
    name: string;
    value: string;
    e: KeyboardEvent<HTMLTableCellElement>;
  }) => {
    if (
      e.key === "Enter" &&
      value.trim() !== "Enter Formula" &&
      value.trim() !== ""
    ) {
      e.preventDefault();
      e.stopPropagation();
      console.log("Updated Variable:", { name, value });
      updatedVariable({ name, value });
    }
  };

  const handleBlur = (
    name: string,
    value: string,
    e: FocusEvent<HTMLTableCellElement>
  ) => {
    if (value.trim() === "Enter Formula" || value.trim() === "") {
      e.currentTarget.innerText = "";
      return;
    }
    updatedVariable({ name, value });
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
                  const isResultCell = cell.column.id === "result";
                  console.log("Cell:", row.getValue("value"));
                  return (
                    <td
                      contentEditable
                      key={cell.id}
                      className="p-2 border-b border-black max-w-[400px] w-full overflow-hidden text-ellipsis"
                      onBlur={(e) => {
                        if (isValueCell) {
                          handleBlur(
                            row.getValue("name"),
                            (e.target as HTMLTableCellElement).innerText,
                            e
                          );
                        }
                      }}
                      onKeyDown={(e) => {
                        if (isValueCell) {
                          handleUpdatedVariable({
                            name: row.getValue("name"),
                            value: (e.target as HTMLTableCellElement).innerText,
                            e: e,
                          });
                        }
                      }}
                    >
                      {isResultCell
                        ? calculator(
                            String(row.getValue("value")),
                            variables,
                            variables.find(
                              (v) => v.name === row.getValue("name")
                            )?.id
                          )
                        : flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
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
};

export default Table;
