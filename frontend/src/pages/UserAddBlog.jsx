import React, { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import toast from 'react-hot-toast'
import { assets, blogCategories } from '../assets/assets'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAppContext } from '../context/AppContext'

const UserAddBlog = () => {
  const { axios, getToken } = useAppContext()

  const editorRef = useRef(null)
  const quillRef = useRef(null)

  const [isAdding, setIsAdding] = useState(false)
  const [image, setImage] = useState(false)
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [category, setCategory] = useState('Startup')

  const onSubmitHandle = async (e) => {
    e.preventDefault()
    try {
      setIsAdding(true)
      const token = await getToken()
      const blog = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
        isPublished: false
      }
      const formData = new FormData()
      formData.append('blog', JSON.stringify(blog))
      formData.append('image', image)

      const { data } = await axios.post('/blog/add-user', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!data.success) {
        return toast.error(data.message)
      }

      toast.success(data.message)
      setImage(false)
      setTitle('')
      setSubTitle('')
      setCategory('Startup')
      quillRef.current.root.innerHTML = ''
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsAdding(false)
    }
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
  }, [])

  return (
    <>
      <Navbar />
      <div className='bg-blue-50/50 text-gray-600 min-h-[70vh] py-8 px-5'>
        <form onSubmit={onSubmitHandle} className="bg-white w-full max-w-3xl p-4 md:p-10 mx-auto rounded shadow">
          <h2 className='text-2xl font-semibold text-gray-800'>Submit a Blog</h2>
          <p className='text-sm mt-1 text-gray-500'>Your post will be sent to admin for review and approval.</p>

          <p className="mt-6">Upload Thumbnail</p>
          <label htmlFor="image">
            <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" className='mt-2 h-16 rounded cursor-pointer' />
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
          </label>

          <p className='mt-4'>Blog Title</p>
          <input type="text" placeholder='Type here' required className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' onChange={(e) => setTitle(e.target.value)} value={title} />

          <p className='mt-4'>Sub Title</p>
          <input type="text" placeholder='Type here' required className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' onChange={(e) => setSubTitle(e.target.value)} value={subTitle} />

          <p className='mt-4'>Blog Description</p>
          <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
            <div ref={editorRef}></div>
          </div>

          <p className='mt-4'>Blog Category</p>
          <select onChange={(e) => setCategory(e.target.value)} value={category} name="category" className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded'>
            {blogCategories.map((item, index) => (
              <option key={index} value={item}>{item}</option>
            ))}
          </select>

          <button disabled={isAdding} type="submit" className='mt-8 w-44 h-10 bg-primary text-white rounded cursor-pointer text-sm disabled:opacity-70'>
            {isAdding ? 'Submitting...' : 'Submit for Review'}
          </button>
        </form>
      </div>
      <Footer />
    </>
  )
}

export default UserAddBlog
