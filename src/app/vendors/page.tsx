import { supabase } from '@/lib/supabase'
import VendorCard from '@/components/VendorCard'
import VendorFilters from '@/components/VendorFilters'

type Vendor = {
  id: string
  name: string
  location: string
  specialty: string
  verified: boolean
  photo_url?: string
}

type Review = {
  vendor_id: string
  rating: number
}

type SearchParams = {
  search?: string
  location?: string
  verified?: string
}

export default async function VendorsPage({ searchParams }: { searchParams?: SearchParams }) {
  const { data: vendorsRaw, error: vendorError } = await supabase.from('vendors').select('*')
  if (vendorError) {
    return <div className="p-6 text-red-600">Failed to load vendors: {vendorError.message}</div>
  }

  const { data: reviewsRaw, error: reviewError } = await supabase
    .from('reviews')
    .select('vendor_id, rating')

  if (reviewError) {
    return <div className="p-6 text-red-600">Failed to load reviews: {reviewError.message}</div>
  }

  let filtered = vendorsRaw ?? []

  if (searchParams?.search) {
    filtered = filtered.filter(v =>
      v.name.toLowerCase().includes(searchParams.search!.toLowerCase())
    )
  }

  if (searchParams?.location) {
    filtered = filtered.filter(v => v.location === searchParams.location)
  }

  if (searchParams?.verified === 'true') {
    filtered = filtered.filter(v => v.verified)
  } else if (searchParams?.verified === 'false') {
    filtered = filtered.filter(v => !v.verified)
  }

  const ratingsMap: Record<string, number[]> = {}
  for (const r of reviewsRaw ?? []) {
    if (!ratingsMap[r.vendor_id]) ratingsMap[r.vendor_id] = []
    ratingsMap[r.vendor_id].push(r.rating)
  }

  const withRatings = filtered.map(v => {
    const ratings = ratingsMap[v.id] || []
    const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0
    return { ...v, avgRating }
  })

  const sortedVendors = withRatings.sort((a, b) => b.avgRating - a.avgRating)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">Explore Trusted Vendors</h1>
      <p className="text-center text-gray-500 mb-8 max-w-xl mx-auto">
        Discover verified professionals across various beauty and lifestyle services. Compare ratings, locations, and specialties.
      </p>

      <VendorFilters />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {sortedVendors.map(vendor => (
          <VendorCard key={vendor.id} vendor={vendor} rating={vendor.avgRating} />
        ))}
      </div>
    </div>
  )
}
