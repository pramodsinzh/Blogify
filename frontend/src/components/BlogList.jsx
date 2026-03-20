import React, { useEffect, useMemo, useRef, useState } from 'react'
import { assets, blogCategories } from '../assets/assets'
import { motion } from "motion/react"
import BlogCard from './BlogCard'
import BlogListSkeleton from './BlogListSkeleton'
import { useAppContext } from '../context/AppContext'
import { useNavigate, useSearchParams } from 'react-router-dom'

const BlogList = ({ maxRows = 2, showSeeAllButton = true } = {}) => {
  const gridRef = useRef(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const menuFromQuery = searchParams.get('menu')

  const [menu, setMenu] = useState(() => menuFromQuery || "All")
  const [columnCount, setColumnCount] = useState(null)

  const { blogs, input } = useAppContext()

  useEffect(() => {
    if (menuFromQuery) setMenu(menuFromQuery)
    else setMenu("All")
  }, [menuFromQuery])

  useEffect(() => {
    const computeColumnCount = () => {
      if (!gridRef.current) return null
      const style = window.getComputedStyle(gridRef.current)
      const cols = style.gridTemplateColumns
      if (!cols || cols === 'none' || cols.includes('repeat(')) return null

      const parts = cols.split(' ').filter(Boolean)
      const n = parts.length
      return n > 0 ? n : null
    }

    const update = () => setColumnCount(computeColumnCount())
    update()

    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const filteredBlogs = useMemo(() => {
    if (!Array.isArray(blogs)) return []
    if (input === '') return blogs

    const q = input.toLowerCase()
    return blogs.filter(
      (blog) =>
        (blog.title && blog.title.toLowerCase().includes(q)) ||
        (blog.category && blog.category.toLowerCase().includes(q))
    )
  }, [blogs, input])

  const baseBlogs = useMemo(() => {
    return filteredBlogs.filter((blog) => menu === "All" ? true : blog.category === menu)
  }, [filteredBlogs, menu])

  const shouldLimit = typeof maxRows === 'number' && maxRows > 0
  const visibleLimitCount = shouldLimit ? maxRows * (columnCount || 4) : null
  const visibleBlogs = shouldLimit ? baseBlogs.slice(0, visibleLimitCount) : baseBlogs

  const isEmpty = baseBlogs.length === 0

  const handleSeeAll = () => {
    const qs = menu && menu !== 'All' ? `?menu=${encodeURIComponent(menu)}` : ''
    navigate(`/see-all-blogs${qs}`)
  }

  // blogs is null while fetching from MongoDB
  if (!Array.isArray(blogs)) return <BlogListSkeleton />

  return (
    <>
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

      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40"
      >
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
          visibleBlogs.map((blog) => (
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

      {showSeeAllButton && shouldLimit && baseBlogs.length > visibleBlogs.length && (
        <div className="flex justify-center -mt-6 mb-24 px-6">
          <button
            onClick={handleSeeAll}
            className="rounded-full bg-primary text-white px-10 py-2.5 text-sm hover:scale-105 transition-all cursor-pointer shadow-sm"
          >
            See all blogs
          </button>
        </div>
      )}
    </>
  )
}

export default BlogList