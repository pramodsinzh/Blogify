import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, blog_data, comments_data } from '../assets/assets'
import Navbar from '../components/Navbar'
import Moment from 'moment'
import Footer from '../components/Footer'
import { Loader } from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Blog = () => {
  const { id } = useParams()

  const {axios} = useAppContext()

  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')

  const fetchBlogData = async () => {
    try {
       const {data} = await axios.get(`/blog/${id}`)
       data.success ? setData(data.blog) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchComments = async () => {
    try {
      const {data} = await axios.get(`/blog/comments?blogId=${id}`)
      if(data.success){
        setComments(data.comments)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post('/blog/add-comment', {blog: id, name, content})
      if(data.success){
        toast.success(data.message)
        setName('')
        setContent('')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      'facebook-share',
      'width=600,height=400'
    )
  }

  const shareOnTwitter = () => {
    const text = data?.title || 'Check out this blog post!'
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
      'twitter-share',
      'width=550,height=420'
    )
  }

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      'linkedin-share',
      'width=600,height=550'
    )
  }

  useEffect(() => {
    fetchBlogData()
    fetchComments()
  }, [id])
  return data ? (
    <div className='relative'>
      <img src={assets.gradientBackground} className='absolute -top-50 -z-1 opacity-50' alt="" />

      <Navbar />

      <div className="text-center mt-20 text-gray-600">
        <p className='text-primary py-4 font-medium'>Published on {Moment(data.createdAt).format('MMMM Do YYYY')}</p>
        <h1 className='text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800'>{data.title}</h1>
        <h2 className='my-5 max-w-lg truncate mx-auto'>{data.subTitle}</h2>
        <p className='inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary'>
          {data.category}
        </p>
      </div>

      <div className="mx-5 max-w-5xl md:mx-auto my-10 mt-6">
        <img src={data.image} className='rounded-3xl mb-5' alt="" />
        <div className='rich-text max-w-3xl mx-auto' dangerouslySetInnerHTML={{ __html: data.description }}></div>
      </div>

      {/* comment section */}
      <div className="mt-14 mb-10 max-w-3xl mx-auto">
        <p className="font-semibold mb-4">Comments ({comments.length})</p>
        <div className="flex flex-col gap-4">
          {comments.map((item, index) => (
            <div key={index} className='relative bg-primary/2 border  border-primary/5 max-w-xl p-4 text-gray-600 rounded'>
              <div className="flex items-center gap-2 mb-2">
                <img src={assets.user_icon} className='w-6  ' alt="" />
                <p className='font-medium'>{item.name}</p>
              </div>
              <div className="text-sm max-w-md ml-8">{item.content}</div>
              <div className="absolute right-4 bottom-3 flex items-center gap-2 text-xs">
                {Moment(item.createdAt).fromNow()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add comment section */}
      <div className="max-w-3xl mx-auto">
        <p className="font-semibold mb-4">Add your comment</p>
        <form onSubmit={addComment} className='flex flex-col items-start gap-4 max-w-lg'>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Name' required className='w-full p-2 border border-gray-300 rounded outline-none' />

          <textarea onChange={(e) => setContent(e.target.value)} value={content} placeholder='Comment' required className='w-full p-2 border border-gray-300 rounded outline-none h-48'></textarea>

          <button type='submit' className='bg-primary text-white rounded p-2 px-8 hover:scale-102 transition-all cursor-pointer'>Submit</button>
        </form>
      </div>

      {/* Share Buttons */}
      <div className="my-24 max-w-3xl mx-auto">
        <p className="font-semibold my-4">Share this blog on social media</p>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={shareOnFacebook}
            className="p-2 rounded-lg hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
            aria-label="Share on Facebook"
            title="Facebook"
          >
            <img src={assets.facebook_icon} width={50} height={50} alt="Facebook" className="cursor-pointer" />
          </button>
          <button
            type="button"
            onClick={shareOnTwitter}
            className="p-2 rounded-lg hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
            aria-label="Share on X (Twitter)"
            title="X"
          >
            <img src={assets.twitter_icon} width={50} height={50} alt="X (Twitter)" className="cursor-pointer" />
          </button>
          <button
            type="button"
            onClick={shareOnLinkedIn}
            className="p-2 rounded-lg hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
            aria-label="Share on LinkedIn"
            title="LinkedIn"
          >
            <img src={assets.linkdin_logo} width={50} height={50} alt="LinkedIn" className="cursor-pointer" />
          </button>
        </div>
      </div>
      <Footer/>
    </div>
  ) :  <Loader className='size-12' /> 
}

export default Blog