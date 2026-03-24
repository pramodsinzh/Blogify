import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAppContext } from '../context/AppContext'

const statusClassMap = {
  published: 'text-green-600',
  pending: 'text-amber-600',
  draft: 'text-slate-600',
  rejected: 'text-red-600'
}

const MyBlogs = () => {
  const { axios, getToken, navigate } = useAppContext()
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    let isMounted = true

    ;(async () => {
      try {
        const token = await getToken()
        const { data } = await axios.get('/blog/my-blogs', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!data.success) return toast.error(data.message)
        if (isMounted) setBlogs(data.blogs || [])
      } catch (error) {
        toast.error(error.message)
      }
    })()

    return () => {
      isMounted = false
    }
  }, [axios, getToken])

  return (
    <>
      <Navbar />
      <div className='min-h-[70vh] bg-blue-50/50 px-5 py-10'>
        <div className='max-w-4xl mx-auto bg-white rounded-lg shadow p-6'>
          <h1 className='text-2xl font-semibold text-gray-800'>My Blogs</h1>
          <p className='text-sm text-gray-500 mt-1'>Track your submitted posts and review status.</p>

          <div className='mt-6 overflow-x-auto'>
            <table className='w-full text-sm text-gray-700'>
              <thead className='text-left border-b border-gray-200'>
                <tr>
                  <th className='py-3'>Title</th>
                  <th className='py-3'>Category</th>
                  <th className='py-3'>Submitted</th>
                  <th className='py-3'>Status</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className='border-b border-gray-100 hover:bg-blue-50/40 cursor-pointer'
                    onClick={() => navigate(`/blog/${blog._id}`)}
                  >
                    <td className='py-3 pr-3 underline-offset-2 hover:underline'>{blog.title}</td>
                    <td className='py-3 pr-3'>{blog.category}</td>
                    <td className='py-3 pr-3'>{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td className={`py-3 capitalize font-medium ${statusClassMap[blog.status] || 'text-gray-700'}`}>
                      {blog.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {blogs.length === 0 && (
              <p className='text-gray-500 py-8 text-center'>No blogs submitted yet.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default MyBlogs
