import React from 'react'
import { assets } from '../../assets/assets'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/admin/Sidebar';
import { useAppContext } from '../../context/AppContext';

const Layout = () => {
     const { axios, setToken, navigate} = useAppContext()

    const logout = () => {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setToken(null)
      navigate('/')
    }
    

  return (
    < > 
        <div className="flex items-center justify-between py-2 px-4 sm:px-12 border-b border-gray-200 h-17.5">
            <img src={assets.logo} className='w-32 sm:w-40 cursor-pointer' onClick={() => navigate('/')} alt="" />
            <button onClick={logout} className='text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer'>Logout</button>
        </div>
        <div className="flex h-[calc(100vh-70px)]">
            <Sidebar />
            <Outlet />
        </div>
    </>
  )
}

export default Layout