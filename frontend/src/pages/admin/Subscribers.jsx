import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import SubscriberTableItem from '../../components/admin/SubscriberTableItem'

const Subscribers = () => {
  const { axios } = useAppContext()
  const [subscribers, setSubscribers] = useState([])

  const fetchSubscribers = async () => {
    try {
      const { data } = await axios.get('/admin/subscribers')
      if (data.success) {
        setSubscribers(Array.isArray(data.subscriptions) ? data.subscriptions : [])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch subscribers')
    }
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  return (
    <div className='flex-1 px-5 pt-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
      <div className="flex justify-between items-center max-w-3xl">
        <h1>Subscribers</h1>
        <p className="text-sm text-gray-500">{subscribers.length} active</p>
      </div>
      <div className="relative h-4/5 mt-4 max-w-3xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white">
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-xs text-gray-700 text-left uppercase'>
            <tr>
              <th scope='col' className='px-6 py-3'>#</th>
              <th scope='col' className='px-6 py-3'>Email</th>
              <th scope='col' className='px-6 py-3 max-sm:hidden'>Subscribed</th>
              <th scope='col' className='px-6 py-3'>Action</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  No subscribers yet.
                </td>
              </tr>
            ) : (
              subscribers.map((sub, index) => (
                <SubscriberTableItem
                  key={sub._id}
                  subscriber={sub}
                  index={index + 1}
                  fetchSubscribers={fetchSubscribers}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Subscribers
