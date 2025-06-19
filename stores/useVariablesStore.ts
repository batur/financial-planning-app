import { create } from "zustand";
import type { TableDataItem } from "@/hooks/useGetTableData";

type VariableStore = {
  variables: TableDataItem[];
  setInitialVariables: (variables: TableDataItem[]) => void;
  setNewVariables: (variableName: string) => void;
};

const useVariablesStore = create<VariableStore>((set) => ({
  variables: [],
  setInitialVariables: (variables: TableDataItem[]) =>
    set(() => ({ variables })),
  setNewVariables: (variableName: string) => {
    set((state) => ({
      variables: [
        ...state.variables,
        {
          name: variableName,
          id: String(state.variables.length + 1),
          value: "",
          category: "default",
        },
      ],
    }));
  },
}));

export default useVariablesStore;
