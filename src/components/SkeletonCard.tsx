"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
      <CardContent className="p-6">
        <div className="mt-4 space-y-2">
          <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-32 w-9" />
            ))}
            </div>
          <div className="flex gap-4">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-4 w-[30px]" />
            ))}
           </div>
          </div>
        </div>
      </CardContent>
  )
}

