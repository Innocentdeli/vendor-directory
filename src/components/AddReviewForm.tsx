'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Star } from 'lucide-react'

export default function AddReviewForm({ vendorId }: { vendorId: string }) {
  const router = useRouter()
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('reviews')
      .insert({ vendor_id: vendorId, rating, comment })

    setLoading(false)

    if (error) {
      toast.error('Failed to submit review.')
    } else {
      toast.success('Review submitted!')
      setComment('')
      setRating(5)
      router.refresh()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-200 max-w-2xl mx-auto"
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Leave a Review</h3>

      {/* Star Rating */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
              className="focus:outline-none"
              aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
            >
              <Star
                size={28}
                strokeWidth={1.5}
                fill={(hover || rating) >= n ? '#facc15' : 'none'}
                className={(hover || rating) >= n ? 'text-yellow-400' : 'text-gray-300'}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-5">
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Comment
        </label>
        <textarea
          id="comment"
          rows={4}
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Submit */}
      <div className="text-right">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  )
}
