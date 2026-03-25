import React from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const BlogTableItem = ({blog, fetchBlogs, index}) => {

    const { title, createdAt, authorName, status } = blog;
    const BlogDate = new Date(createdAt)

    const { axios, fetchBlogs: refreshPublicBlogs } = useAppContext()
    const isPending = blog.status === "pending"

    const deleteBlog = async () => {
      const confirm = window.confirm('Are you sure want to delete this blog?')
      if(!confirm) return;
      try {
        const {data} = await axios.delete('/blog/delete', { data: { id: blog._id } })
        if(data.success){
          toast.success(data.message)
          // Refresh admin table
          await fetchBlogs()
          // Refresh public blog list in context
          if (typeof refreshPublicBlogs === 'function') {
            await refreshPublicBlogs()
          }
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    const togglePublish = async () => {
      try {
        const {data} = await axios.post('/blog/toggle-publish', {id: blog._id})
        if(data.success){
          toast.success(data.message)
          // Refresh admin table
          await fetchBlogs()
          // Refresh public blog list in context
          if (typeof refreshPublicBlogs === 'function') {
            await refreshPublicBlogs()
          }
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    const reviewBlog = async (action) => {
      try {
        const { data } = await axios.post('/blog/review', { id: blog._id, action })
        if (data.success) {
          toast.success(data.message)
          await fetchBlogs()
          if (typeof refreshPublicBlogs === 'function') {
            await refreshPublicBlogs()
          }
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

  return (
    <tr className='border-y border-gray-300'> 
        <th className='px-2 py-4'>{index}</th>
        <td className='px-2 py-4'>
          <p>{title}</p>
          <p className='text-[11px] text-gray-500 mt-1'>Author: {authorName || "Admin"}</p>
        </td>
        <td className='px-2 py-4 max-sm:hidden'>{BlogDate.toDateString()}</td>
        <td className='px-2 py-4 max-sm:hidden'>
            <p className={`${blog.isPublished ? "text-green-600" : "text-orange-700"}`}>{status || (blog.isPublished ? "published" : "unpublished")}</p>
        </td>
        <td className='px-2 py-4 flex text-xs gap-3'>
            {isPending ? (
              <>
                <button onClick={() => reviewBlog("approve")} className='border border-green-600 text-green-700 px-2 py-0.5 mt-1 rounded cursor-pointer'>Approve</button>
                <button onClick={() => reviewBlog("reject")} className='border border-red-600 text-red-700 px-2 py-0.5 mt-1 rounded cursor-pointer'>Reject</button>
              </>
            ) : (
              <button onClick={togglePublish} className='border px-2 py-0.5 mt-1 rounded cursor-pointer'>{blog.isPublished ? "Unpublish" : "Publish"}</button>
            )}
            <img onClick={deleteBlog} src={assets.cross_icon} className='w-8 hover:scale-110 transition-all cursor-pointer border-3 rounded-full border-red-800' alt="" />
        </td>
    </tr>
  )
}

export default BlogTableItem