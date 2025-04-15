
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const VisitSubmissionForm = () => {
  return (
    <div className="space-y-2">
      <Label>Check-in na loja</Label>
      <div className="bg-galaxy-deepPurple/80 rounded-md p-4">
        <p className="text-center">
          Pressione o botão abaixo para realizar check-in usando sua localização atual
        </p>
        <Button className="w-full mt-4">
          Fazer Check-in
        </Button>
      </div>
    </div>
  );
};

export default VisitSubmissionForm;
