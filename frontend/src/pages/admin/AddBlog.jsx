import React, { useEffect, useRef, useState } from 'react'
import { assets, blogCategories } from '../../assets/assets'
import Quill from 'quill'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { marked } from 'marked'

const AddBlog = () => {

  const { axios } = useAppContext()
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)

  const editorRef = useRef(null)
  const quillRef = useRef(null)

  const [image, setImage] = useState(false);
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [category, setCategory] = useState('Startup');
  const [isPublished, setIsPublished] = useState(false);

  const generateContent = async () => {
    if(!title) return toast.error('Please enter a title')
      try {
        setLoading(true)
        const {data} = await axios.post('/blog/generate', {prompt: title})
        if(data.success){
          // Clean and format the content
          let content = data.content.trim()
          
          // Ensure proper markdown formatting
          // Convert multiple newlines to proper paragraph breaks
          content = content.replace(/\n{3,}/g, '\n\n')
          
          // Parse markdown to HTML
          const htmlContent = marked.parse(content)
          
          // Set content using Quill's API for better formatting
          const delta = quillRef.current.clipboard.convert({ html: htmlContent })
          quillRef.current.setContents(delta, 'silent')
          
          // Alternative: Direct HTML insertion if delta doesn't work well
          // quillRef.current.root.innerHTML = htmlContent
        }else{
          toast.error(data.message)
        }
        
      } catch (error) {
        toast.error(error.message)
      }finally{
        setLoading(false)
      }
  }

  const onSubmitHandle = async (e) => {
    try {
      e.preventDefault()
      setIsAdding(true)

      const blog = {
        title, subTitle,
        description: quillRef.current.root.innerHTML,
        category, isPublished
      }
      const fromData = new FormData()
      fromData.append('blog', JSON.stringify(blog))
      fromData.append('image', image)

      const { data } = await axios.post('/blog/add', fromData)

      if (data.success) {
        toast.success(data.message)
        setImage(false)
        setTitle('')
        quillRef.current.root.innerHTML = ''
        setCategory('Startup')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsAdding(false)
    }
  }

  useEffect(() => {
    //Initiate quill only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
  }, [])

  return (
    <form onSubmit={onSubmitHandle} className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'>
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 rounded shadow">
        <p>Upload Thumbnail</p>
        <label htmlFor="image">
          <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" className='mt-2 h-16 rounded cursor-pointer' />
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
        </label>

        <p className='mt-4'>Blog Title</p>
        <input type="text" placeholder='Type here' required className='w-full
        max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' onChange={e => setTitle(e.target.value)} value={title} />

        <p className='mt-4'>Sub Title</p>
        <input type="text" placeholder='Type here' required className='w-full
        max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' onChange={e => setSubTitle(e.target.value)} value={subTitle} />

        <p className='mt-4'>Blog Description</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef}></div>
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600 font-medium">Generating content with AI...</p>
              </div>
            </div>
          )}
          <button type='button' disabled={loading} onClick={generateContent} className='absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'>Generate with AI</button>
        </div>

        <p className='mt-4'>Blog Category</p>
        <select onChange={e => setCategory(e.target.value)} name="category" className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded' id="">
          <option value="">Select catgory</option>
          {blogCategories.map((item, index) => {
            return <option key={index} value={item}>{item}</option>
          })}
        </select>

        <div className="flex gap-2 mt-4">
          <p>Publish Now</p>
          <input type="checkbox" checked={isPublished} className='scale-125 cursor-pointer' onChange={e => setIsPublished(e.target.checked)} />
        </div>

        <button disabled={isAdding} type="submit" className='mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm'>
          {isAdding ? 'Adding...' : 'Add Blog'}
        </button>

      </div>
    </form>
  )
}

export default AddBlog