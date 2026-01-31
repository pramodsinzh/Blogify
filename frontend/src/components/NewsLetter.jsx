import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const NewsLetter = () => {
  const { axios } = useAppContext()
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // New blog toasts are handled by AppContext (single socket for whole app)
  // Check if email is already subscribed (from localStorage)
  useEffect(() => {
    const subscribedEmail = localStorage.getItem('subscribedEmail');
    if (subscribedEmail) {
      setIsSubscribed(true);
      setEmail(subscribedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await axios.post('/subscription/subscribe', { email });

      if (data.success) {
        toast.success(data.message);
        setIsSubscribed(true);
        localStorage.setItem('subscribedEmail', email);
        setEmail('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to subscribe');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnsubscribe = async () => {
    const subscribedEmail = localStorage.getItem('subscribedEmail');
    if (!subscribedEmail) return;

    try {
      const { data } = await axios.post('/subscription/unsubscribe', { email: subscribedEmail });

      if (data.success) {
        toast.success(data.message);
        setIsSubscribed(false);
        localStorage.removeItem('subscribedEmail');
        setEmail('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to unsubscribe');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center text-center space-y-2 my-32'>
        <h1 className='md:text-4xl text-2xl font-semibold'>Never Miss a Blog!</h1>
        <p className='md:text-lg text-gray-500/70 pb-8'>Subscribe to get the latest blog, new tech, and exclusive news.</p>
        
        {isSubscribed ? (
          <div className='flex flex-col items-center space-y-4 max-w-2xl w-full'>
            <div className='bg-green-50 border border-green-200 rounded-md p-4 w-full'>
              <p className='text-green-800 font-medium'>✓ You're subscribed!</p>
              <p className='text-sm text-green-600 mt-1'>You'll receive notifications when new blogs are posted.</p>
            </div>
            <button 
              onClick={handleUnsubscribe}
              className='text-sm text-gray-500 hover:text-gray-700 underline'
            >
              Unsubscribe
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='flex items-center justify-between max-w-2xl w-full md:h-13 h-12'>
              <input 
                className='border border-gray-300 rounmd h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500' 
                type="email" 
                placeholder='Enter your email id' 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                disabled={isSubmitting}
              />
              <button 
                type='submit' 
                disabled={isSubmitting}
                className='md:px-12 px-8 h-full text-white bg-primary/80 hover:bg-primary transition-all cursor-pointer rounded-md rounded-l-none disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
          </form>
        )}
    </div>
  )
}

export default NewsLetter