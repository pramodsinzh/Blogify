import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import About from './pages/About'
import Faqs from './pages/Faqs'
import Contact from './pages/Contact'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddBlog from './pages/admin/AddBlog'
import ListBlog from './pages/admin/ListBlog'
import Comments from './pages/admin/Comments'
import Subscribers from './pages/admin/Subscribers'
import 'quill/dist/quill.snow.css'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import SeeAllBlogs from './pages/SeeAllBlogs'
import { SignIn } from '@clerk/react'
import MyBlogs from './pages/MyBlogs'
import Navbar from './components/Navbar'
import UserAddBlog from './pages/UserAddBlog'

const App = () => {

  const isAdminRoute = useLocation().pathname.startsWith('/admin')
  const { token } = useAppContext()
  const { user } = useAppContext()

  return (
    <div>
      <Toaster />
      {/* {!isAdminRoute && <Navbar/>} */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/blog/:id' element={<Blog />} />
        <Route path='/about' element={<About />} />
        <Route path='/faqs' element={<Faqs />} />
        <Route path='/contact' element={<Contact />} />

        <Route path='/user' element={user ? <Layout /> : (<div className="min-h-screen flex justify-center items-center"><SignIn fallbackRedirectUrl={'/'} /></div>)}>

        </Route>
          <Route path='/add-blog' element={<UserAddBlog />} />
          <Route path='/see-all-blogs' element={<SeeAllBlogs />} />
          <Route path='/my-blogs' element={<MyBlogs />} />

        <Route path='/admin/*' element={user ? <Layout /> : (<div className="min-h-screen flex justify-center items-center"><SignIn fallbackRedirectUrl={'/admin'} /></div>)}>
          <Route index element={<Dashboard />} />
          <Route path='addBlog' element={<AddBlog />} />
          <Route path='listBlog' element={<ListBlog />} />
          <Route path='comments' element={<Comments />} />
          <Route path='subscribers' element={<Subscribers />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App