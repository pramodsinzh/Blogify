import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const About = () => {
  return (
    <>
      <Navbar />

      <main className="px-6 md:px-16 lg:px-24 xl:px-32 py-16 text-gray-700">
        <section className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">About Blogify</h1>
          <p className="text-base md:text-lg leading-relaxed">
            Blogify is built for curious minds. Whether you are a developer, a founder, a student, or
            simply someone who loves learning, our goal is to make complex topics feel simple,
            approachable, and enjoyable.
          </p>
          <p className="text-base md:text-lg leading-relaxed">
            Every article is crafted with care — focusing on clarity, real-world examples, and
            actionable takeaways. No fluff, no clickbait. Just helpful content you can actually use.
          </p>
          <p className="text-base md:text-lg leading-relaxed">
            We believe in slowing down, reading deeply, and sharing ideas that make people think,
            build, and grow. If that sounds like you, you&apos;re in the right place.
          </p>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default About

