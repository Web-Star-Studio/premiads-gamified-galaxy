import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SubmissionsLoading = () => {
  return (
    <Card className="border-galaxy-purple bg-galaxy-darkPurple">
      <CardContent className="p-6">
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div 
              key={index}
              className="p-4 rounded-lg border border-galaxy-purple/50 bg-gradient-to-tr from-galaxy-dark/20 to-galaxy-darkPurple/30"
            >
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-5 w-24" />
                  </div>
                  
                  <Skeleton className="h-40 w-full mt-4" />
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionsLoading;
