
import { useState, useEffect } from "react";
import { Shield, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SubmissionsList from "./SubmissionsList";
import { Skeleton } from "@/components/ui/skeleton";

const ModerationContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-7 h-7 text-neon-cyan" />
          <h1 className="text-2xl font-bold">Moderação de Conteúdo</h1>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input 
              placeholder="Buscar submissão..." 
              className="pl-9 bg-gray-800/50 border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select 
            defaultValue="all" 
            onValueChange={(value) => setFilterStatus(value)}
          >
            <SelectTrigger className="w-36 bg-gray-800/50 border-gray-700">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="approved">Aprovados</SelectItem>
              <SelectItem value="rejected">Rejeitados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="pending" className="gap-2">
            Pendentes
            <Badge variant="glow" className="ml-1">12</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            Aprovados
            <Badge variant="success" className="ml-1">45</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            Rejeitados
            <Badge variant="warning" className="ml-1">8</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          {isLoading ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Submissões Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border border-gray-700 rounded-lg">
                      <div className="flex gap-4">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                      <Skeleton className="h-40 w-full mt-4" />
                      <div className="flex justify-end gap-2 mt-4">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <SubmissionsList 
              filterStatus={filterStatus} 
              searchQuery={searchQuery}
              tabValue="pending" 
            />
          )}
        </TabsContent>
        
        <TabsContent value="approved">
          {isLoading ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Submissões Aprovadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 border border-gray-700 rounded-lg">
                      <div className="flex gap-4">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                      <Skeleton className="h-40 w-full mt-4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <SubmissionsList 
              filterStatus={filterStatus} 
              searchQuery={searchQuery}
              tabValue="approved" 
            />
          )}
        </TabsContent>
        
        <TabsContent value="rejected">
          {isLoading ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Submissões Rejeitadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 border border-gray-700 rounded-lg">
                      <div className="flex gap-4">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                      <Skeleton className="h-40 w-full mt-4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <SubmissionsList 
              filterStatus={filterStatus} 
              searchQuery={searchQuery}
              tabValue="rejected" 
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModerationContent;
