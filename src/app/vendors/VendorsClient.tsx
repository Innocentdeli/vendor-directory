'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import VendorCard from '@/components/VendorCard'
import VendorFilters from '@/components/VendorFilters'
import type { Vendor } from '@/types'


export default function VendorsPage() {
  const searchParams = useSearchParams()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true)

      const { data: vendorsRaw } = await supabase.from('vendors').select('*')
      const { data: reviewsRaw } = await supabase.from('reviews').select('vendor_id, rating')

      let filtered = vendorsRaw ?? []

      const search = searchParams.get('search')?.toLowerCase() || ''
      const location = searchParams.get('location') || ''
      const verified = searchParams.get('verified')

      if (search) {
        filtered = filtered.filter(v => v.name.toLowerCase().includes(search))
      }

      if (location) {
        filtered = filtered.filter(v => v.location === location)
      }

      if (verified === 'true') {
        filtered = filtered.filter(v => v.isVerified)
      } else if (verified === 'false') {
        filtered = filtered.filter(v => !v.isVerified)
      }      

      const ratingsMap: Record<string, number[]> = {}
      for (const r of reviewsRaw ?? []) {
        if (!ratingsMap[r.vendor_id]) ratingsMap[r.vendor_id] = []
        ratingsMap[r.vendor_id].push(r.rating)
      }

      const withRatings = filtered.map(v => {
        const ratings = ratingsMap[v.id] || []
        const averageRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0
        return { ...v, averageRating } as Vendor
      })      

      const sorted = withRatings.sort((a, b) => b.averageRating - a.averageRating)

      setVendors(sorted)
      setLoading(false)
    }

    fetchVendors()
  }, [searchParams])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">Explore Trusted Vendors</h1>
      <p className="text-center text-gray-500 mb-8 max-w-xl mx-auto">
        Discover verified professionals across various beauty and lifestyle services. Compare ratings, locations, and specialties.
      </p>

      <VendorFilters />

      {loading ? (
        <p className="text-center mt-6">Loading vendors...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {vendors.map(v => (
            <VendorCard key={v.id} vendor={v} rating={v.averageRating} />
          ))}
        </div>
      )}
    </div>
  )
}
