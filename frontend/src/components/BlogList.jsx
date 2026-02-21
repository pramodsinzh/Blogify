import React, { useState } from 'react'
import { assets, blogCategories } from '../assets/assets'
import { motion } from "motion/react"
import BlogCard from './BlogCard'
import BlogListSkeleton from './BlogListSkeleton'
import { useAppContext } from '../context/AppContext'

const BlogList = () => {
  const [menu, setMenu] = useState("All")
  const { blogs, input } = useAppContext()

  // blogs is null while fetching from MongoDB
  if (!Array.isArray(blogs)) return <BlogListSkeleton />

  const filteredBlogs = () => {
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