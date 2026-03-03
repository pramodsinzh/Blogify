import React from 'react'
import { Link } from 'react-router-dom'
import { assets, footer_data } from '../assets/assets'

const Footer = () => {
    return (
        <footer className="bg-primary/3  mt-10">
            <div className="mx-auto max-w-6xl px-6 md:px-8 lg:px-10 xl:px-12">
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-6 text-sm text-gray-600 border-b border-gray-200">
                    {footer_data.map((section, index) => (
                        <div key={index} className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            {/* <h3 className='font-semibold text-gray-900 text-base md:mb-0 mb-2'>{section.title}</h3> */}
                            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <Link
                                            className="hover:text-gray-900 hover:underline transition-colors duration-150"
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

                <p className="py-4 text-center text-xs md:text-sm text-gray-500 border-t border-gray-100">
                    Copyright 2026 © Blogify - All Right Reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer