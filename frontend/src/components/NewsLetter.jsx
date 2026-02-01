import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const NewsLetter = () => {
  const { axios } = useAppContext()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUnsubmitting, setIsUnsubmitting] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }
    setIsSubmitting(true)
    try {
      const { data } = await axios.post('/subscription/subscribe', { email })
      if (data.success) {
        toast.success(data.message)
        setEmail('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to subscribe')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUnsubscribe = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your email address to unsubscribe')
      return
    }
    const confirmed = window.confirm('Are you sure you want to unsubscribe from our newsletter?')
    if (!confirmed) return
    setIsUnsubmitting(true)
    try {
      const { data } = await axios.post('/subscription/unsubscribe', { email })
      if (data.success) {
        toast.success(data.message)
        setEmail('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to unsubscribe')
    } finally {
      setIsUnsubmitting(false)
    }
  }

  const busy = isSubmitting || isUnsubmitting

  return (
    <div className='flex flex-col items-center justify-center text-center space-y-2 my-32'>
      <h1 className='md:text-4xl text-2xl font-semibold'>Never Miss a Blog!</h1>
      <p className='md:text-lg text-gray-500/70 pb-8'>Subscribe to get the latest blog, new tech, and exclusive news.</p>

      <form onSubmit={handleSubscribe} className='flex flex-col items-center gap-3 max-w-2xl w-full'>
        <div className='flex items-center justify-between w-full md:h-13 h-12'>
          <input
            className='border border-gray-300 h-full border-r-0 outline-none w-full rounded-l-md px-3 text-gray-500'
            type="email"
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={busy}
          />
          <button
            type='submit'
            disabled={busy}
            className='md:px-8 px-6 h-full text-white bg-primary/80 hover:bg-primary transition-all cursor-pointer rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
        <button
          type="button"
          onClick={handleUnsubscribe}
          disabled={busy}
          className="text-sm font-medium text-primary/80 hover:text-primary italic underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-all duration-300 ease-out disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isUnsubmitting ? "Unsubscribing..." : "Already subscribed? Unsubscribe anytime."}
        </button>

      </form>
    </div>
  )
}

export default NewsLetter
