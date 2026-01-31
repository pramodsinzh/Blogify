import React from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const SubscriberTableItem = ({ subscriber, index, fetchSubscribers }) => {
  const { _id, email, createdAt } = subscriber
  const { axios } = useAppContext()
  const subscribedDate = createdAt ? new Date(createdAt).toLocaleDateString() : '—'

  const deleteSubscriber = async () => {
    try {
      const confirm = window.confirm('Are you sure you want to remove this subscriber?')
      if (!confirm) return
      const { data } = await axios.delete('/admin/delete-subscribers', { data: { id: _id } })
      if (data.success) {
        toast.success(data.message)
        fetchSubscribers()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to remove subscriber')
    }
  }

  return (
    <tr className='border-y border-gray-200'>
      <td className='px-6 py-4'>{index}</td>
      <td className='px-6 py-4 font-medium text-gray-700'>{email}</td>
      <td className='px-6 py-4 max-sm:hidden text-gray-500'>{subscribedDate}</td>
      <td className='px-6 py-4'>
        <button
          type="button"
          onClick={deleteSubscriber}
          className="w-5 transition-all cursor-pointer hover:scale-110"
          title="Remove subscriber"
        >
          <img src={assets.bin_icon} className='w-5 h-5' alt="Remove" />
        </button>
      </td>
    </tr>
  )
}

export default SubscriberTableItem
