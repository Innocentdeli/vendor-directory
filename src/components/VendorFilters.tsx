'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const LOCATIONS = ['Lagos', 'Abuja', 'Port Harcourt', 'Enugu', 'Ibadan', 'Benin City']

export default function VendorFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [verified, setVerified] = useState(searchParams.get('verified') || '')

  const updateQuery = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (location) params.set('location', location)
    if (verified) params.set('verified', verified)
    router.push(`/vendors?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-end gap-4 bg-[#f9fafb] p-4 rounded-xl border border-gray-200">
      <div className="flex flex-col">
        <label htmlFor="search" className="text-sm text-gray-700 mb-1">Search</label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="e.g. Braider, Studio"
          className="w-48 text-gray-600 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="location" className="text-sm text-gray-700 mb-1">Location</label>
        <select
          id="location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="w-48 px-3 text-gray-600 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">All Locations</option>
          {LOCATIONS.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="verified" className="text-sm text-gray-700 mb-1">Verified</label>
        <select
          id="verified"
          value={verified}
          onChange={e => setVerified(e.target.value)}
          className="w-48 px-3 text-gray-600 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">All</option>
          <option value="true">Verified Only</option>
          <option value="false">Unverified Only</option>
        </select>
      </div>

      <button
        onClick={updateQuery}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2 rounded-lg transition"
      >
        Apply
      </button>
    </div>
  )
}
