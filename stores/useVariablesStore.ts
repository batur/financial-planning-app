import { create } from "zustand";
import type { TableDataItem } from "@/hooks/useGetTableData";

type VariableStore = {
  variables: TableDataItem[];
  setInitialVariables: (variables: TableDataItem[]) => void;
  setNewVariables: ({ name, value }: { name: string; value?: string }) => void;
  updatedVariable: ({ name, value }: { name: string; value: string }) => void;
};

const useVariablesStore = create<VariableStore>((set) => ({
  variables: [],
  setInitialVariables: (variables: TableDataItem[]) =>
    set(() => ({ variables })),
  setNewVariables: ({ name, value }) => {
    set((state) => ({
      variables: [
        ...state.variables,
        {
          name: name,
          id: String(state.variables.length + 1),
          value: value || "",
          category: "default",
        },
      ],
    }));
  },
  updatedVariable: ({ name, value }) => {
    set((state) => ({
      variables: state.variables.map((variable) =>
        variable.name === name ? { ...variable, value } : variable
      ),
    }));
  },
}));

export default useVariablesStore;
