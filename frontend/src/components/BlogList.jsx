import React, { useState } from 'react'
import { assets, blogCategories } from '../assets/assets'
import { motion } from "motion/react"
import BlogCard from './BlogCard'
import { useAppContext } from '../context/AppContext'

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

// ─── Skeleton Grid ─────────────────────────────────────────────────────────────
const BlogListSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40">
    {Array.from({ length: 8 }).map((_, i) => (
      <BlogCardSkeleton key={i} />
    ))}
  </div>
)

// ─── Category Tab Skeleton ─────────────────────────────────────────────────────
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

// ─── BlogList ──────────────────────────────────────────────────────────────────
const BlogList = () => {
  const [menu, setMenu] = useState("All")
  const { blogs, input } = useAppContext()

  // While blogs haven't loaded yet (null/undefined), show skeleton
  const isLoading = !Array.isArray(blogs)

  const filteredBlogs = () => {
    if (!Array.isArray(blogs)) return []
    if (input === '') return blogs
    return blogs.filter((blog) =>
      (blog.title && blog.title.toLowerCase().includes(input.toLowerCase())) ||
      (blog.category && blog.category.toLowerCase().includes(input.toLowerCase()))
    )
  }

  const displayBlogs = filteredBlogs().filter(
    (blog) => menu === "All" ? true : blog.category === menu
  )
  const isEmpty = displayBlogs.length === 0

  if (isLoading) {
    return (
      <>
        <CategorySkeleton />
        <BlogListSkeleton />
      </>
    )
  }

  return (
    <>
      {/* Category Filter */}
      <div className="flex justify-center gap-4 sm:gap-8 my-10 relative">
        {blogCategories.map((item) => (
          <div key={item} className="relative">
            <button
              onClick={() => setMenu(item)}
              className={`cursor-pointer text-gray-500 ${menu === item && 'text-white px-4 pt-0.5'}`}
            >
              {item}
              {menu === item && (
                <motion.div
                  layoutId='underline'
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute left-0 right-0 top-0 h-7 -z-1 bg-primary rounded-full"
                />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40">
        {isEmpty ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <img src={assets.nothing} alt="icon" className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No blogs yet</h3>
            <p className="text-gray-500 max-w-md">
              {blogs?.length === 0
                ? "We're working on something great. Check back soon for new stories and ideas."
                : "No blogs match your search or this category. Try another filter or search term."}
            </p>
          </div>
        ) : (
          displayBlogs.map((blog) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BlogCard blog={blog} />
            </motion.div>
          ))
        )}
      </div>
    </>
  )
}

export default BlogList