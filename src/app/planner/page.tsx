import { Suspense } from "react";
import type { Metadata } from "next";
import { PlannerShell } from "@/components/planner/PlannerShell";
import { PlannerRoom } from "@/components/planner/PlannerRoom";

export const metadata: Metadata = {
  title: "DeltaPlant Planner",
};

export default function PlannerPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-dvh place-items-center bg-[#0f100c] text-sm font-semibold text-stone-300">
          Loading planner
        </div>
      }
    >
      <PlannerRoom />
    </Suspense>
  );
}
