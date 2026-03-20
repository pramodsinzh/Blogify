import React from 'react' 
import BlogList from '../components/BlogList' 
import BackToHome from '../components/BackToHome'

const SeeAllBlogs = () => {
  return (
    <> 
      <BlogList maxRows={null} showSeeAllButton={false} />
      <BackToHome /> 
    </>
  )
}

export default SeeAllBlogs
