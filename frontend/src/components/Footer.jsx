import React from 'react'
import { Link } from 'react-router-dom'
import { assets, footer_data } from '../assets/assets'

const Footer = () => {
    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/3'>
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">

                <div className="">
                    <img src={assets.logo} alt="logo" className='w-32 sm:w-44' />
                    <p className="max-w-102.5 mt-6">
                        Blogify is your go-to platform for sharing stories, insights, and ideas. Discover engaging content, connect with a vibrant community, and start your blogging journey today.
                    </p>
                </div>
                <div className="flex flex-wrap justify-between w-full gap-5 md:w-[45%]">
                    {footer_data.map((section, index) => (
                        <div key={index}>
                            <h3 className='font-semibold text-base text-gray-900 md:mb-5 mb-2'>{section.title}</h3>
                            <ul className='text-sm space-y-1'>
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <Link
                                            className='hover:underline transition'
                                            to={link.href}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

            </div>
            <p className='py-4 text-center text-sm md:text-base text-gray-500/80'>Copyright 2026 © Blogify - All Right Reserved.</p>
        </div>
    )
}

export default Footer