
import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  Plus, 
  History, 
  ArrowUpRight, 
  ArrowDownLeft,
  Check,
  Wallet,
  DollarSign,
  BadgePercent,
  Calculator
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Simulated transaction data
const transactions = [
  { id: 1, date: "15/04/2025", type: "purchase", amount: 500, status: "completed", description: "Compra de créditos" },
  { id: 2, date: "10/04/2025", type: "usage", amount: -100, status: "completed", description: "Campanha: Verão 2025" },
  { id: 3, date: "05/04/2025", type: "purchase", amount: 200, status: "completed", description: "Compra de créditos" },
  { id: 4, date: "01/04/2025", type: "usage", amount: -50, status: "completed", description: "Campanha: Promoção Relâmpago" },
  { id: 5, date: "25/03/2025", type: "bonus", amount: 100, status: "completed", description: "Bônus de fidelidade" },
];

// Credit package options
const creditPackages = [
  { id: 1, name: "Básico", credits: 500, price: "R$ 199,90", popular: false, features: ["Créditos válidos por 3 meses", "Suporte por e-mail"] },
  { id: 2, name: "Profissional", credits: 1500, price: "R$ 499,90", popular: true, features: ["Créditos válidos por 6 meses", "Suporte prioritário", "Análises avançadas"] },
  { id: 3, name: "Empresarial", credits: 5000, price: "R$ 1499,90", popular: false, features: ["Créditos válidos por 12 meses", "Suporte VIP", "Análises avançadas", "Campanhas prioritárias"] },
];

const CreditsPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { playSound } = useSounds();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("balance");
  const [credits, setCredits] = useState(650);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    playSound("pop");
  };
  
  const handlePurchase = (packageId: number) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const selectedPackage = creditPackages.find(p => p.id === packageId);
      if (selectedPackage) {
        setCredits(prev => prev + selectedPackage.credits);
        
        toast({
          title: "Compra realizada com sucesso",
          description: `${selectedPackage.credits} créditos foram adicionados à sua conta`,
        });
        
        playSound("chime");
      }
      
      setIsLoading(false);
    }, 1500);
  };
  
  const calculateTotalCredits = () => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  };
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdvertiserSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <AdvertiserHeader />
          
          <div className="container px-4 pt-20 py-8 mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Gerenciamento de Créditos</h1>
              <p className="text-muted-foreground">Adquira e acompanhe seus créditos para campanhas</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Saldo Atual</h3>
                    <Wallet className="h-5 w-5 text-neon-cyan" />
                  </div>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold">{credits}</span>
                    <span className="text-sm ml-2 mb-1 text-muted-foreground">créditos</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Utilizados (30 dias)</h3>
                    <Calculator className="h-5 w-5 text-neon-pink" />
                  </div>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold">150</span>
                    <span className="text-sm ml-2 mb-1 text-muted-foreground">créditos</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Valor por Crédito</h3>
                    <BadgePercent className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold">R$ 0,33</span>
                    <span className="text-sm ml-2 mb-1 text-muted-foreground">média</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
              <TabsList>
                <TabsTrigger value="balance">Meu Saldo</TabsTrigger>
                <TabsTrigger value="packages">Comprar Créditos</TabsTrigger>
                <TabsTrigger value="history">Histórico</TabsTrigger>
              </TabsList>
              
              <TabsContent value="balance" className="mt-6">
                <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                  <CardHeader>
                    <CardTitle>Resumo da Conta</CardTitle>
                    <CardDescription>Visão geral dos seus créditos e movimentações</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-galaxy-purple/10 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <ArrowUpRight className="text-green-400 h-5 w-5" />
                            <span className="font-medium">Créditos Adicionados</span>
                          </div>
                          <p className="text-2xl font-bold">800</p>
                          <p className="text-xs text-muted-foreground mt-1">Últimos 3 meses</p>
                        </div>
                        
                        <div className="p-4 bg-galaxy-purple/10 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <ArrowDownLeft className="text-neon-pink h-5 w-5" />
                            <span className="font-medium">Créditos Utilizados</span>
                          </div>
                          <p className="text-2xl font-bold">150</p>
                          <p className="text-xs text-muted-foreground mt-1">Últimos 3 meses</p>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-galaxy-purple/5 border border-galaxy-purple/20 rounded-lg">
                        <h3 className="font-medium mb-3">Utilização por Campanha</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Verão 2025</p>
                              <p className="text-xs text-muted-foreground">Ativa</p>
                            </div>
                            <p>100 créditos</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Promoção Relâmpago</p>
                              <p className="text-xs text-muted-foreground">Concluída</p>
                            </div>
                            <p>50 créditos</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-galaxy-purple/20 pt-4">
                    <Button variant="outline" onClick={() => handleTabChange("history")}>
                      <History className="h-4 w-4 mr-2" />
                      Ver Histórico Completo
                    </Button>
                    <Button onClick={() => handleTabChange("packages")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Comprar Créditos
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="packages" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {creditPackages.map((pkg) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: pkg.id * 0.1 }}
                    >
                      <Card className={`h-full flex flex-col ${pkg.popular ? 'border-neon-cyan border-2' : 'border-galaxy-purple/30'} bg-galaxy-darkPurple`}>
                        {pkg.popular && (
                          <div className="bg-neon-cyan text-black text-xs font-bold px-3 py-1 absolute right-4 top-0 transform -translate-y-1/2 rounded">
                            POPULAR
                          </div>
                        )}
                        <CardHeader className="pb-2">
                          <CardTitle>{pkg.name}</CardTitle>
                          <CardDescription>{pkg.credits} créditos</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <div className="mb-4">
                            <p className="text-3xl font-bold">{pkg.price}</p>
                            <p className="text-sm text-muted-foreground">
                              {(parseFloat(pkg.price.replace("R$ ", "").replace(",", ".")) / pkg.credits).toFixed(2)} por crédito
                            </p>
                          </div>
                          <ul className="space-y-2">
                            {pkg.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="w-full" 
                            variant={pkg.popular ? "default" : "outline"}
                            onClick={() => handlePurchase(pkg.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <div className="flex items-center">
                                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                                Processando
                              </div>
                            ) : (
                              <>
                                <CreditCard className="h-4 w-4 mr-2" />
                                Comprar
                              </>
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="mt-6">
                <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                  <CardHeader>
                    <CardTitle>Histórico de Transações</CardTitle>
                    <CardDescription>Registro de compras e utilizações de créditos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead className="text-right">Quantidade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {transaction.type === "purchase" && (
                                  <><CreditCard className="h-4 w-4 text-green-400" /> Compra</>
                                )}
                                {transaction.type === "usage" && (
                                  <><ArrowDownLeft className="h-4 w-4 text-neon-pink" /> Uso</>
                                )}
                                {transaction.type === "bonus" && (
                                  <><Plus className="h-4 w-4 text-neon-cyan" /> Bônus</>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className={`text-right ${
                              transaction.amount > 0 ? 'text-green-400' : 'text-neon-pink'
                            }`}>
                              {transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CreditsPage;
