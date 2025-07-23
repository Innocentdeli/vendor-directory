import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import StarRating from '@/components/StarRating';
import AddReviewForm from '@/components/AddReviewForm';

type PageProps = {
  params: Promise<{ id: string }>;
};

type Vendor = {
  id: string;
  name: string;
  specialty: string;
  location: string;
  verified: boolean;
};

type Review = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Vendor Profile - ${id}`,
  };
}

export default async function VendorProfilePage({ params }: PageProps) {
  const { id } = await params;

  const { data: vendor, error: vendorError } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', id)
    .single<Vendor>();

    const { data: rawReviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('vendor_id', id)
    .order('created_at', { ascending: false }) as { data: Review[] | null };
  
  const reviews = rawReviews ?? [];
  
  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : null;
  

  if (vendorError || !vendor) {
    return <div className="p-6 text-red-600">Vendor not found.</div>;
   }

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
  );
}
