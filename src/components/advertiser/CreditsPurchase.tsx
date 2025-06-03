
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Coins } from "lucide-react";

interface CreditsPurchaseProps {
  currentCredits?: number;
}

const CreditsPurchase = ({ currentCredits = 0 }: CreditsPurchaseProps) => {
  return (
    <Card className="border-gray-800 bg-gray-900/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Coins className="h-5 w-5 text-yellow-400" />
          Comprar Créditos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <p className="text-sm text-gray-400">Saldo atual</p>
            <p className="text-2xl font-bold text-white">{currentCredits} créditos</p>
          </div>
          <CreditCard className="h-8 w-8 text-blue-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-700 rounded-lg hover:border-blue-500 transition-colors">
            <h3 className="font-semibold text-white">Pacote Básico</h3>
            <p className="text-sm text-gray-400 mb-2">1.000 créditos</p>
            <p className="text-lg font-bold text-blue-400 mb-3">R$ 50,00</p>
            <Button size="sm" className="w-full">Comprar</Button>
          </div>
          
          <div className="p-4 border border-gray-700 rounded-lg hover:border-blue-500 transition-colors">
            <h3 className="font-semibold text-white">Pacote Premium</h3>
            <p className="text-sm text-gray-400 mb-2">5.000 créditos</p>
            <p className="text-lg font-bold text-blue-400 mb-3">R$ 200,00</p>
            <Button size="sm" className="w-full">Comprar</Button>
          </div>
          
          <div className="p-4 border border-gray-700 rounded-lg hover:border-blue-500 transition-colors">
            <h3 className="font-semibold text-white">Pacote Empresarial</h3>
            <p className="text-sm text-gray-400 mb-2">15.000 créditos</p>
            <p className="text-lg font-bold text-blue-400 mb-3">R$ 500,00</p>
            <Button size="sm" className="w-full">Comprar</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditsPurchase;
