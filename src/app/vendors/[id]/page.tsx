import { supabase } from '@/lib/supabase'
import StarRating from '@/components/StarRating'
import AddReviewForm from '@/components/AddReviewForm'

export default async function VendorProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const { data: vendor } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', params.id)
    .single()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('vendor_id', params.id)
    .order('created_at', { ascending: false })

  if (!vendor) {
    return <div className="p-6 text-red-600">Vendor not found.</div>
  }

  const reviewCount = reviews?.length ?? 0
  const avgRating =
    reviewCount > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : null

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 bg-white text-[#171717]">
      <div className="border-b pb-4 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">{vendor.name}</h1>
        <p className="text-sm text-gray-600 mt-1">
          {vendor.specialty} • {vendor.location}
        </p>

        <div className="flex items-center gap-2 mt-2">
          {vendor.verified && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              Verified Vendor
            </span>
          )}
          {avgRating !== null && (
            <div className="flex items-center gap-1">
              <StarRating value={avgRating} />
              <span className="text-sm text-gray-500">
                ({reviewCount} review{reviewCount !== 1 && 's'})
              </span>
            </div>
          )}
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">Customer Reviews</h2>
        {reviewCount > 0 ? (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-gray-50 border rounded-lg p-3 shadow-sm">
                <StarRating value={r.rating} />
                <p className="text-sm text-gray-700 mt-1">{r.comment}</p>
                <span className="text-xs text-gray-400 block mt-1">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No reviews yet. Be the first to leave one!</p>
        )}
      </section>

      <details className="mt-8 group open:pb-4 transition-all">
        <summary className="cursor-pointer text-blue-600 font-medium hover:underline text-sm">
          Leave a Review
        </summary>
        <div className="mt-2">
          <AddReviewForm vendorId={vendor.id} />
        </div>
      </details>
    </div>
  )
}
