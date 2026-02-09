import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Contact = () => {
  return (
    <>
      <Navbar />

      <main className="px-6 md:px-16 lg:px-24 xl:px-32 py-16 text-gray-700">
        <section className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-base md:text-lg leading-relaxed">
            Have feedback, a collaboration idea, or a question about Blogify? We&apos;d love to hear from you.
            Drop us a message using the form below and we&apos;ll get back to you as soon as we can.
          </p>

          <form
            className="space-y-4 bg-white/70 border border-gray-200 rounded-xl p-6 shadow-sm mt-4"
            onSubmit={(e) => {
              e.preventDefault()
              // You can wire this up to your backend or a service like Formspree later.
              alert('Thanks for reaching out! This contact form is a demo in this version.')
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-800" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/40"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-800" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/40"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/40"
                placeholder="Tell us how we can help..."
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            >
              Send Message
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Contact

