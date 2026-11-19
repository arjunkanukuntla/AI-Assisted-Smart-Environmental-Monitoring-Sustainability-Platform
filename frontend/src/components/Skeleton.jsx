import React from 'react';

/** Single shimmer bar. Use className to set width/height/rounded. */
export function SkeletonBar({ className = '' }) {
  return (
    <div
      className={`bg-zinc-800 animate-pulse rounded ${className}`}
      aria-hidden="true"
    />
  );
}

/** Full-page skeleton for data-heavy pages (stations, analytics, admin). */
export function PageSkeleton() {
  return (
    <div className="space-y-5 font-sans" aria-label="Loading…">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-2">
          <SkeletonBar className="h-5 w-48" />
          <SkeletonBar className="h-3.5 w-72" />
        </div>
        <SkeletonBar className="h-8 w-28 rounded-md" />
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#121215] border border-[#27272A] rounded-lg p-3.5 space-y-2">
            <SkeletonBar className="h-3 w-28" />
            <SkeletonBar className="h-7 w-16" />
            <SkeletonBar className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Main content area */}
      <div className="bg-[#121215] border border-[#27272A] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#27272A]">
          <SkeletonBar className="h-4 w-40" />
        </div>
        <div className="divide-y divide-[#27272A]">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-4">
              <SkeletonBar className="h-3.5 w-6 shrink-0" />
              <SkeletonBar className="h-3.5 w-48 flex-1" />
              <SkeletonBar className="h-3.5 w-20 hidden sm:block" />
              <SkeletonBar className="h-3.5 w-16 hidden md:block" />
              <SkeletonBar className="h-5 w-14 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Skeleton for the analytics/chart page. */
export function ChartPageSkeleton() {
  return (
    <div className="space-y-5 font-sans" aria-label="Loading…">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <SkeletonBar className="h-5 w-52" />
          <SkeletonBar className="h-3.5 w-80" />
        </div>
        <SkeletonBar className="h-8 w-32 rounded-md" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#121215] border border-[#27272A] rounded-lg p-3.5 space-y-2">
            <SkeletonBar className="h-3 w-28" />
            <SkeletonBar className="h-7 w-16" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-[#121215] border border-[#27272A] rounded-lg p-4 space-y-3">
            <SkeletonBar className="h-4 w-40" />
            <SkeletonBar className="h-56 w-full rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
