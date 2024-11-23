import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CategoryChartSkeleton() {
    return (
      <>
      <div className="flex items-center justify-center h-[200px]">
        <div className="relative w-40 h-40">
          <Skeleton className="absolute inset-0 rounded-full" />
          <Skeleton className="absolute top-1/2 left-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </div>
      </div>
      <div className="mt-2 space-y-1 m-2">
        <Skeleton className="h-4 " />
            </div>
            </>
  )
}

