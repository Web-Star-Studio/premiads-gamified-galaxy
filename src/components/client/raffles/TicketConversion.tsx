
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { Calculator, CreditCard, HelpCircle, Ticket, TrendingUp } from "lucide-react";

// Mock user data
const USER_POINTS = 750;
const USER_TICKETS = 8;
const CONVERSION_RATE = 100; // 100 points = 1 ticket

const TicketConversion = () => {
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [points, setPoints] = useState(USER_POINTS);
  const [tickets, setTickets] = useState(USER_TICKETS);
  const [conversionAmount, setConversionAmount] = useState(100);
  const [isConverting, setIsConverting] = useState(false);
  
  const maxConversion = Math.min(Math.floor(points / CONVERSION_RATE) * CONVERSION_RATE, 500);
  
  const handleSliderChange = (value: number[]) => {
    // Ensure the value is a multiple of CONVERSION_RATE
    const amount = Math.round(value[0] / CONVERSION_RATE) * CONVERSION_RATE;
    setConversionAmount(amount);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value) || 0;
    
    // Ensure the value is a multiple of CONVERSION_RATE
    value = Math.floor(value / CONVERSION_RATE) * CONVERSION_RATE;
    
    // Ensure it doesn't exceed the available points
    value = Math.min(value, maxConversion);
    
    setConversionAmount(value);
  };
  
  const getTicketsFromPoints = (pointsAmount: number) => {
    return Math.floor(pointsAmount / CONVERSION_RATE);
  };
  
  const handleConvert = () => {
    if (conversionAmount <= 0 || conversionAmount > points) {
      toast({
        title: "Conversão inválida",
        description: "Verifique a quantidade de pontos para conversão",
        variant: "destructive",
      });
      playSound("error");
      return;
    }
    
    setIsConverting(true);
    
    // Simulate conversion process
    setTimeout(() => {
      const newTickets = getTicketsFromPoints(conversionAmount);
      setPoints(prev => prev - conversionAmount);
      setTickets(prev => prev + newTickets);
      setConversionAmount(Math.min(CONVERSION_RATE, maxConversion - conversionAmount));
      setIsConverting(false);
      
      // Show success message
      toast({
        title: "Conversão realizada!",
        description: `Você converteu ${conversionAmount} pontos em ${newTickets} tickets!`,
      });
      
      playSound("reward");
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.div 
        className="lg:col-span-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-galaxy-deepPurple/30 border-galaxy-purple/20 h-full">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-neon-cyan" />
              Suas Estatísticas
            </CardTitle>
            <CardDescription>
              Confira seus pontos e tickets disponíveis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-galaxy-deepPurple/50 rounded-lg p-4 border border-galaxy-purple/30">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">Pontos disponíveis</div>
                <div className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-1 text-neon-lime" />
                  <span className="font-bold text-neon-lime">{points}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-galaxy-deepPurple/50 rounded-lg p-4 border border-galaxy-purple/30">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">Tickets disponíveis</div>
                <div className="flex items-center">
                  <Ticket className="w-4 h-4 mr-1 text-neon-cyan" />
                  <span className="font-bold text-neon-cyan">{tickets}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-galaxy-deepPurple/50 rounded-lg p-4 border border-galaxy-purple/30">
              <div className="flex items-center mb-2">
                <HelpCircle className="w-4 h-4 mr-2 text-neon-pink" />
                <h4 className="font-medium">Como funciona?</h4>
              </div>
              <p className="text-sm text-gray-400">
                Converta seus pontos em tickets para participar de sorteios exclusivos. A taxa de conversão é de {CONVERSION_RATE} pontos por ticket.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div 
        className="lg:col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-galaxy-deepPurple/30 border-galaxy-purple/20 h-full">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Calculator className="w-5 h-5 text-neon-pink" />
              Conversor de Pontos
            </CardTitle>
            <CardDescription>
              Converta seus pontos em tickets para participar de sorteios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm text-gray-400">
                  Quantidade de pontos para converter
                </label>
                
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={conversionAmount}
                    onChange={handleInputChange}
                    min={0}
                    max={maxConversion}
                    step={CONVERSION_RATE}
                    className="bg-galaxy-deepPurple/50 border-galaxy-purple/30 text-right"
                  />
                  <span className="text-sm text-gray-400 whitespace-nowrap">de {points} pontos</span>
                </div>
                
                <Slider
                  defaultValue={[conversionAmount]}
                  max={maxConversion}
                  step={CONVERSION_RATE}
                  value={[conversionAmount]}
                  onValueChange={handleSliderChange}
                  className="my-6"
                />
                
                <div className="flex justify-between text-sm text-gray-400">
                  <span>0</span>
                  <span>{maxConversion}</span>
                </div>
              </div>
              
              <div className="bg-galaxy-deepPurple/50 rounded-lg p-4 border border-galaxy-purple/30">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Você receberá:</div>
                  <div className="flex items-center">
                    <Ticket className="w-4 h-4 mr-1 text-neon-cyan" />
                    <span className="font-bold text-neon-cyan">
                      {getTicketsFromPoints(conversionAmount)} tickets
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  className="neon-button"
                  disabled={conversionAmount <= 0 || conversionAmount > points || isConverting}
                  onClick={handleConvert}
                >
                  {isConverting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-t-white/20 border-white rounded-full animate-spin mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <Ticket className="w-4 h-4 mr-2" />
                      Converter Pontos
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TicketConversion;
