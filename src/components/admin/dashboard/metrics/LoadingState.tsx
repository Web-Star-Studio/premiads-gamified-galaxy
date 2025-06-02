
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingState = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="relative overflow-hidden">
          <div className="p-6 space-y-4">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-4 w-[120px]" />
          </div>
        </Card>
      ))}
    </div>
  );
