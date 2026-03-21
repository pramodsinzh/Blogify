import React from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { useClerk, UserButton, useUser } from '@clerk/react'
import { TicketPlus } from 'lucide-react'

const Navbar = () => {

    const { navigate, token } = useAppContext()
    const { user } = useUser()
    const { openSignIn } = useClerk()

    return (
        <>
            <div className='flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32'>
                <img onClick={() => navigate('/')} src={assets.logo} alt="logo" className='w-32 sm:w-44 cursor-pointer' />

                {
                    !user ? (
                        <button /* onClick={() => navigate('/admin')} */ onClick={openSignIn} className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5'>
                            {token ? 'Dashboard' : 'Login'}
                            <img src={assets.arrow} className='w-3' alt="login" />
                        </button>
                    ) : (
                        <UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Action
                                    label='My Blogs'
                                    labelIcon={<TicketPlus width={15} />}
                                    onClick={() => navigate('/my-blogs')}
                                />
                            </UserButton.MenuItems>
                        </UserButton>
                    )
                }
            </div>
        </>
    )
}

export default Navbar