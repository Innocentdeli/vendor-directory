'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { supabase } from '@/lib/supabase';

type Vendor = {
  id: string;
  name: string;
  specialty: string;
  image: string;
};

export default function Home() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVendors() {
      const { data, error } = await supabase
        .from('vendors')
        .select('id, name, specialty, image')
        .limit(10);

      if (error) {
        console.error('Error loading vendors:', error.message);
      } else {
        setVendors(data || []);
      }

      setLoading(false);
    }

    fetchVendors();
  }, []);

  return (
    <main className="font-sans min-h-screen flex flex-col bg-white text-gray-900">
      {/* Hero Section */}
      <header className="text-center py-20 bg-gradient-to-br from-pink-100 to-purple-200 px-6">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
          Discover Trusted Beauty Vendors in Nigeria
        </h1>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
          Browse top-rated hairstylists, makeup artists, and beauty professionals you can trust.
        </p>
        <Link
          href="/vendors"
          className="inline-block bg-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-700 transition shadow-md"
        >
          View All Vendors
        </Link>
      </header>

      {/* Carousel Section */}
      <section className="py-16">
        <h2 className="text-3xl font-semibold text-center mb-10">Popular Vendors</h2>
        <div className="max-w-6xl mx-auto px-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading vendors...</p>
          ) : vendors.length === 0 ? (
            <p className="text-center text-gray-500">No vendors found.</p>
          ) : (
            <Swiper
              slidesPerView={1.1}
              spaceBetween={20}
              pagination={{ clickable: true }}
              navigation
              modules={[Pagination, Navigation]}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {vendors.map((vendor) => (
                <SwiperSlide key={vendor.id}>
                  <Link
                    href={`/vendors/${vendor.id}`}
                    className="block bg-white shadow-sm rounded-2xl overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1"
                  >
                    <div className="relative w-full h-60">
                      <Image
                        src={`${vendor.image}?auto=format&fit=crop&w=800&q=80`}
                        alt={vendor.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{vendor.name}</h3>
                      <p className="text-sm text-gray-500">{vendor.specialty}</p>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-500 bg-gray-50">
        © {new Date().getFullYear()} Beauty Trust. All rights reserved.
      </footer>
    </main>
  );
}
