import { Star, StarHalf, Star as EmptyStar } from 'lucide-react'

type Props = {
  value: number
  size?: number // optional size prop
}

export default function StarRating({ value, size = 16 }: Props) {
  const fullStars = Math.floor(value)
  const hasHalfStar = value - fullStars >= 0.5
  const totalStars = 5

  return (
    <div className="flex items-center gap-[2px] text-yellow-400">
      {Array.from({ length: totalStars }).map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} size={size} fill="currentColor" className="text-yellow-400" />
        } else if (i === fullStars && hasHalfStar) {
          return <StarHalf key={i} size={size} fill="currentColor" className="text-yellow-400" />
        } else {
          return <Star key={i} size={size} className="text-gray-300" />
        }
      })}
    </div>
  )
}
