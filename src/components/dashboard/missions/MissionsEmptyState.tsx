
import { Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";

const MissionsEmptyState = () => {
  return (
    <CarouselItem className="md:basis-full">
      <Card className="bg-galaxy-deepPurple/30 border-galaxy-purple/20 p-8 text-center">
        <CardContent className="pt-6">
          <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-lg font-medium">Nenhuma missão disponível no momento</p>
          <p className="text-sm text-gray-400 mt-2">Volte mais tarde para novas missões</p>
        </CardContent>
      </Card>
    </CarouselItem>
  );
};

export default MissionsEmptyState;
