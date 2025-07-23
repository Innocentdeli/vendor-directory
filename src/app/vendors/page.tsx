import { Suspense } from 'react'
import VendorsPage from './VendorsClient'

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center mt-6">Loading vendors...</p>}>
      <VendorsPage />
    </Suspense>
  )
}
