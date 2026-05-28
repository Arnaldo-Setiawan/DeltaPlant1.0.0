"use client";

import Image from "next/image";
import type { AssetCategory, PlannerAsset } from "@/types/assets";

const groups: { category: AssetCategory; label: string }[] = [
  { category: "pin", label: "Pins" },
  { category: "vehicle", label: "Vehicles" },
  { category: "construct", label: "Constructs" },
];

interface AssetTrayProps {
  assets: readonly PlannerAsset[];
  onSelectAsset: (asset: PlannerAsset) => void;
}

export function AssetTray({ assets, onSelectAsset }: AssetTrayProps) {
  return (
    <aside className="grid shrink-0 gap-3 border-x border-b border-white/10 bg-[#14150f] p-3 md:grid-cols-3">
      {groups.map((group) => {
        const groupAssets = assets.filter((asset) => asset.category === group.category).slice(0, 8);

        return (
          <section key={group.category} className="min-w-0">
            <div className="mb-2 flex h-5 items-center justify-between">
              <h2 className="truncate text-xs font-bold uppercase tracking-[0.16em] text-stone-400">
                {group.label}
              </h2>
              <span className="text-[11px] font-semibold text-stone-600">{groupAssets.length}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {groupAssets.length > 0 ? (
                groupAssets.map((asset) => (
                  <button
                    type="button"
                    key={asset.id}
                    aria-label={asset.label}
                    title={asset.label}
                    onClick={() => onSelectAsset(asset)}
                    className="grid aspect-square min-h-10 place-items-center rounded-md border border-white/10 bg-black/25 p-1 outline-none transition hover:border-amber-300/50 hover:bg-amber-300/10 focus-visible:ring-2 focus-visible:ring-amber-300"
                  >
                    <Image
                      src={asset.src}
                      alt=""
                      width={32}
                      height={32}
                      className="max-h-7 w-auto object-contain"
                    />
                  </button>
                ))
              ) : (
                <span className="col-span-4 grid h-10 place-items-center rounded-md border border-white/5 bg-black/15 text-xs font-semibold text-stone-600">
                  None
                </span>
              )}
            </div>
          </section>
        );
      })}
    </aside>
  );
}
