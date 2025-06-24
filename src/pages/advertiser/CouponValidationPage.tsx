import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdvertiserSidebar } from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { validateCashbackCoupon } from "@/hooks/cashback/cashbackApi";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  Search, 
  CreditCard,
  Calendar,
  Percent,
  AlertTriangle
} from "lucide-react";

const CouponValidationPage = () => {
  const [shaCode, setShaCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { user } = useAuth();

  const userName = user?.user_metadata?.name || "Anunciante";

  const handleValidation = async () => {
    if (!shaCode.trim()) {
      toast({
        title: "Código obrigatório",
        description: "Por favor, insira o código do cupom.",
        variant: "destructive",
      });
      return;
    }

    // Validate SHA format (7 letters + 3 digits)
    const shaPattern = /^[A-Z]{7}\d{3}$/;
    if (!shaPattern.test(shaCode.toUpperCase())) {
      toast({
        title: "Formato inválido",
        description: "O código deve ter 7 letras maiúsculas seguidas de 3 dígitos.",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      const result = await validateCashbackCoupon(shaCode.toUpperCase());
      setValidationResult(result);

      if (result.success) {
        toast({
          title: "Cupom validado com sucesso!",
          description: "O cupom foi marcado como utilizado.",
        });
      } else {
        toast({
          title: "Validação falhada",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      toast({
        title: "Erro na validação",
        description: "Ocorreu um erro ao validar o cupom. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleReset = () => {
    setShaCode("");
    setValidationResult(null);
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdvertiserSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <AdvertiserHeader
            title="Validação de Cupons"
            userName={userName}
            description="Valide cupons de cashback apresentados pelos clientes"
          />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Validation Form */}
              <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <CreditCard className="mr-2 h-5 w-5 text-neon-cyan" />
                    Validar Cupom de Cashback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sha-code" className="text-gray-300">
                      Código do Cupom
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="sha-code"
                        value={shaCode}
                        onChange={(e) => setShaCode(e.target.value.toUpperCase())}
                        placeholder="ABCDEFG025"
                        className="font-mono bg-galaxy-deepPurple/40 border-galaxy-purple/30 text-white"
                        maxLength={10}
                        disabled={isValidating}
                      />
                      <Button
                        onClick={handleValidation}
                        disabled={isValidating || !shaCode.trim()}
                        className="bg-neon-cyan text-black hover:bg-neon-cyan/80"
                      >
                        {isValidating ? (
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                        {!isMobile && (isValidating ? "Validando..." : "Validar")}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400">
                      Formato: 7 letras maiúsculas + 3 dígitos (ex: ABCDEFG025)
                    </p>
                  </div>

                  {validationResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <Alert className={`border ${
                        validationResult.success 
                          ? 'border-green-500/30 bg-green-500/10' 
                          : 'border-red-500/30 bg-red-500/10'
                      }`}>
                        <div className="flex items-center">
                          {validationResult.success ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400" />
                          )}
                          <AlertDescription className={`ml-2 ${
                            validationResult.success ? 'text-green-300' : 'text-red-300'
                          }`}>
                            {validationResult.message}
                          </AlertDescription>
                        </div>
                      </Alert>

                      {validationResult.tokenData && (
                        <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/10">
                          <CardHeader>
                            <CardTitle className="text-sm text-gray-300">
                              Detalhes do Cupom
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <p className="text-xs text-gray-400">Código SHA</p>
                                <p className="font-mono text-neon-cyan">
                                  {validationResult.tokenData.sha_code}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-gray-400">Desconto</p>
                                <div className="flex items-center">
                                  <Percent className="h-4 w-4 text-neon-cyan mr-1" />
                                  <span className="text-white font-semibold">
                                    {validationResult.tokenData.cashback_percentage}%
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-gray-400">Status</p>
                                <Badge variant={
                                  validationResult.tokenData.status === 'ativo' ? 'default' :
                                  validationResult.tokenData.status === 'usado' ? 'secondary' : 'destructive'
                                }>
                                  {validationResult.tokenData.status}
                                </Badge>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-gray-400">Validade</p>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                  <span className="text-white text-sm">
                                    {new Date(validationResult.tokenData.validade).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <Button
                        onClick={handleReset}
                        variant="outline"
                        className="w-full border-galaxy-purple/30 text-gray-300 hover:bg-galaxy-purple/20"
                      >
                        Validar Novo Cupom
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <AlertTriangle className="mr-2 h-5 w-5 text-yellow-400" />
                    Como usar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-gray-300">
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>1.</strong> Solicite ao cliente o código do cupom de cashback
                    </p>
                    <p className="text-sm">
                      <strong>2.</strong> Digite o código no campo acima (formato: 7 letras + 3 dígitos)
                    </p>
                    <p className="text-sm">
                      <strong>3.</strong> Clique em "Validar" para verificar e marcar como usado
                    </p>
                    <p className="text-sm">
                      <strong>4.</strong> Aplique o desconto correspondente na compra do cliente
                    </p>
                  </div>
                  
                  <Alert className="border-blue-500/30 bg-blue-500/10">
                    <AlertDescription className="text-blue-300 text-sm">
                      <strong>Importante:</strong> Cada cupom só pode ser usado uma vez. 
                      Após a validação, o cupom será automaticamente marcado como utilizado.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CouponValidationPage; 