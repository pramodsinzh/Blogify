import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const faqs = [
  {
    question: 'What is Blogify?',
    answer:
      'Blogify is a modern blogging platform where creators share practical insights, stories, and tutorials across technology, lifestyle, startups, and more.',
  },
  {
    question: 'Who can write on Blogify?',
    answer:
      'Right now, content is curated by our in-house creators. We plan to open up to guest authors and the community in future iterations.',
  },
  {
    question: 'Is Blogify free to use?',
    answer:
      'Yes. You can freely read all published blogs, comment on posts, and subscribe to our newsletter to get new articles in your inbox.',
  },
  {
    question: 'How often are new blogs published?',
    answer:
      'We aim to publish fresh content every week so you always have something new and insightful to read.',
  },
]

const Faqs = () => {
  return (
    <>
      <Navbar />

      <main className="px-6 md:px-16 lg:px-24 xl:px-32 py-16 text-gray-700">
        <section className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-base md:text-lg leading-relaxed">
            Find quick answers to common questions about Blogify. If you can&apos;t find what you&apos;re looking for,
            feel free to reach out via our contact page.
          </p>

          <div className="space-y-4 mt-6">
            {faqs.map((item, index) => (
              <details
                key={index}
                className="group border border-gray-200 rounded-lg p-4 bg-white/70 hover:border-primary/40 transition-colors"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-medium text-gray-900">{item.question}</span>
                  <span className="ml-3 text-primary group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="mt-3 text-sm md:text-base text-gray-600 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Faqs

