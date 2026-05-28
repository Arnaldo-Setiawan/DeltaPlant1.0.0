import { create } from "zustand";
import type { PlannerPhase } from "@/types/phases";

export const initialPhases: PlannerPhase[] = [
  { id: "phase-1", name: "Phase 1", order: 1 },
  { id: "phase-2", name: "Phase 2", order: 2 },
  { id: "phase-3", name: "Phase 3", order: 3 },
];

interface PhaseState {
  phases: PlannerPhase[];
  activePhaseId: string;
  setActivePhaseId: (phaseId: string) => void;
}

export const usePhaseStore = create<PhaseState>((set) => ({
  phases: initialPhases,
  activePhaseId: initialPhases[0].id,
  setActivePhaseId: (phaseId) => set({ activePhaseId: phaseId }),
}));
