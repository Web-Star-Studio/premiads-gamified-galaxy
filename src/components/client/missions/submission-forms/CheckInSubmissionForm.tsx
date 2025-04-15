
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const CheckInSubmissionForm = () => {
  return (
    <div className="form-container">
      <Label className="form-label">Check-in na loja</Label>
      <div className="bg-galaxy-deepPurple/80 rounded-md p-4 md:p-6">
        <p className="text-center text-medium-contrast text-mobile-base">
          Pressione o botão abaixo para realizar check-in usando sua localização atual
        </p>
        <Button 
          className="w-full mt-4 md:mt-6 flex items-center justify-center gap-2 py-3"
          variant="default"
        >
          <MapPin className="w-5 h-5" />
          Fazer Check-in
        </Button>
      </div>
    </div>
  );
};

export default CheckInSubmissionForm;
