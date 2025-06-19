import { useQuery } from "@tanstack/react-query";

const useGetTableData = () => {
  return useQuery({
    queryKey: ["tableData"],
    queryFn: async () => {
      const response = await fetch(
        "https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete"
      );
      if (!response.ok) {
        throw response.statusText;
      }
      return response.json() as Promise<TableDataItem[]>;
    },
  });
};

export default useGetTableData;

export interface TableDataItem {
  name: string;
  category: string;
  value: number | string;
  id: string;
  inputs?: string;
}
