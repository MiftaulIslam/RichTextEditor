import { Skeleton } from "@/Components/ui/skeleton";

const BlogCardSkeleton = ({item_per_page}:{item_per_page:number}) => {
    return (
        <div className="space-y-8">
          {[...Array(item_per_page)].map((_, index) => (
            <div key={index} className="max-w-3xl mx-auto">
              <div className="shadow rounded overflow-hidden">
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex gap-4 items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                    <Skeleton className="w-1/4 h-20 rounded" />
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
}

export default BlogCardSkeleton