import React from 'react'

// ─── Blog Card Skeleton ───────────────────────────────────────────────────────
const BlogCardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm animate-pulse">
    {/* Thumbnail */}
    <div className="w-full h-48 bg-gray-200" />

    {/* Content */}
    <div className="p-4 space-y-3">
      {/* Category tag */}
      <div className="h-5 w-20 bg-gray-200 rounded-full" />

      {/* Title */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>

      {/* Footer: avatar + date */}
      <div className="flex items-center gap-3 pt-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-1">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-2.5 bg-gray-100 rounded w-16" />
        </div>
        <div className="h-3 w-14 bg-gray-100 rounded" />
      </div>
    </div>
  </div>
)

// ─── Category Tab Skeleton ────────────────────────────────────────────────────
const CategorySkeleton = () => (
  <div className="flex justify-center gap-4 sm:gap-8 my-10">
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="h-7 rounded-full bg-gray-200 animate-pulse"
        style={{ width: `${55 + i * 10}px` }}
      />
    ))}
  </div>
)

// ─── Full Skeleton (exported) ─────────────────────────────────────────────────
const BlogListSkeleton = () => (
  <>
    <CategorySkeleton />
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40">
      {Array.from({ length: 8 }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  </>
)

export default BlogListSkeleton