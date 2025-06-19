import { create } from "zustand";

type UIEffectsStore = {
  isNewVariableTriggered: boolean;
  setIsNewVariableTriggered: (value: boolean) => void;
};

const useUIEffectsStore = create<UIEffectsStore>((set) => ({
  isNewVariableTriggered: false,
  setIsNewVariableTriggered: (value: boolean) =>
    set(() => ({ isNewVariableTriggered: value })),
}));

export default useUIEffectsStore;
