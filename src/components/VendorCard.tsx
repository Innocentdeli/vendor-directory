'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import StarRating from './StarRating'
import { BadgeCheck } from 'lucide-react'
import type { Vendor } from '@/types'

type Props = {
  vendor: Vendor
  rating?: number
}

export default function VendorCard({ vendor, rating }: Props) {
  const router = useRouter()
  const fallbackImage = '/placeholder.jpg'

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={() => router.push(`/vendors/${vendor.id}`)}
    >
      <div className="relative w-full h-40">
        <Image
          src={vendor.image || fallbackImage}
          alt={vendor.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-800 truncate">{vendor.name}</h2>
          {vendor.isVerified && (
            <span className="flex items-center text-green-600 text-sm font-medium">
              <BadgeCheck className="w-4 h-4 mr-1" />
              Verified
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500">
          {vendor.location ?? 'Unknown Location'}
        </p>

        {typeof rating === 'number' && (
          <div className="flex items-center gap-1 mt-2">
            <StarRating value={rating} />
            <span className="text-sm text-gray-600">({rating.toFixed(1)})</span>
          </div>
        )}
      </div>
    </div>
  )
}
