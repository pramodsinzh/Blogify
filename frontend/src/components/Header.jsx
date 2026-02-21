import React, { useRef } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Header = () => {
    const { input, setInput } = useAppContext()
    const inputRef = useRef()

    const onSubmitHandler = (e) => {
        e.preventDefault()
        setInput(inputRef.current.value)
    }
    const onClear = () => {
      setInput('')
      inputRef.current.value = ''
    }
    
    return (
        <>
            <div className="mx-8 sm:mx-16 xl:mx-24 relative">
                <div className="text-center mt-20 mb-8">
                    <div className="inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm text-primary">
                        <p>New: AI feature integrated</p>
                        <img src={assets.star_icon} className='w-2.5' alt="" />
                    </div>
                    <h1 className='text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700'>Elevate Your <span className='text-primary'>Blog</span>   <br /> with AI-Powered Insights</h1>

                    <p className='my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500'>This is your space to think out loud, to share what matters, and write without filters. Whether it's one word or a thousand, your story starts right here. </p>

                    <form onSubmit={onSubmitHandler} className='flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-gray-300 bg-white rounded overflow-hidden'>
                        <input ref={inputRef} type="text" placeholder='Search for blogs...' className='w-full pl-4  outline-none' required />
                        <button type='submit' className='bg-primary text-white px-8 py-2 m-1.5 rounded hover:scale-105 transition-all duration-300 cursor-pointer'>Search</button>
                    </form>
                </div>
                <div className="text-center">
                   {input && <button onClick={onClear} className='border font-light text-xs py-1 px-3 rounded-sm shadow-custom-sm cursor-pointer'>Clear Search</button> }
                </div>
                <img src={assets.gradientBackground} className='absolute -top-50 -z-1 opacity-50' alt="" />
            </div>
        </>
    )
}

export default Header
