import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'

const BackToHome = () => {
  const navigate = useNavigate()

  return (
    <motion.button
      onClick={() => navigate('/')}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="mx-8 sm:mx-16 xl:mx-40 fixed bottom-8 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-gray-200 shadow-lg text-gray-700 font-medium text-sm hover:bg-primary hover:text-white hover:border-primary transition-colors duration-300 cursor-pointer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
      </svg>
      Back to Home
    </motion.button>
  )
}

export default BackToHome