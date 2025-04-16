
import { Card, CardContent } from "@/components/ui/card";

const SubmissionsLoading = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center h-40">
          <div className="w-10 h-10 border-4 border-t-neon-cyan border-gray-700 rounded-full animate-spin"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionsLoading;
