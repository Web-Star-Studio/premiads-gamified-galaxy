import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Gift, Users, Building2, Search, Plus, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import DashboardHeader from "@/components/admin/DashboardHeader"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useUsersForRifaDistribution } from "@/hooks/admin/useUsersForRifaDistribution"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import AdminSidebar from "@/components/admin/AdminSidebar"
import { useMediaQuery } from "@/hooks/use-mobile"
import { motion } from "framer-motion"

interface UserProfile {
  id: string
  full_name: string
  email: string
  user_type: string
  rifas: number
  advertiser_rifas?: number
  company_name?: string
}

interface RifaDistribution {
  userId: string
  amount: number
  description: string
}

function RifasManagementPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  // Estados
  const [searchTerm, setSearchTerm] = useState("")
  const [userTypeFilter, setUserTypeFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [rifaAmount, setRifaAmount] = useState([1])
  const [rifaInputValue, setRifaInputValue] = useState("1")
  const [description, setDescription] = useState("")

  // Buscar usuários usando o hook encapsulado
  const { data: users = [], isLoading, error } = useUsersForRifaDistribution({
    searchTerm,
    userTypeFilter
  })

  // Mutation para distribuir rifas
  const distributeMutation = useMutation({
    mutationFn: async (distribution: RifaDistribution) => {
      const { data: user } = await supabase
        .from('profiles')
        .select('rifas, user_type')
        .eq('id', distribution.userId)
        .single()

      if (!user) throw new Error('Usuário não encontrado')

      // Atualizar rifas no perfil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ rifas: user.rifas + distribution.amount })
        .eq('id', distribution.userId)

      if (updateError) throw updateError

      // Se for anunciante, atualizar também na tabela advertiser_profiles
      if (user.user_type === 'anunciante') {
        const { data: advertiserProfile } = await supabase
          .from('advertiser_profiles')
          .select('rifas')
          .eq('user_id', distribution.userId)
          .single()

        if (advertiserProfile) {
          await supabase
            .from('advertiser_profiles')
            .update({ rifas: advertiserProfile.rifas + distribution.amount })
            .eq('user_id', distribution.userId)
        }
      }

      // Registrar transação
      await supabase
        .from('rifas_transactions')
        .insert({
          user_id: distribution.userId,
          transaction_type: 'bonus',
          amount: distribution.amount,
          description: distribution.description || 'Distribuição manual pelo administrador'
        })

      return distribution
    },
    onSuccess: () => {
      toast({
        title: "Rifas distribuídas",
        description: `${rifaAmount[0]} rifas foram distribuídas com sucesso!`,
      })
      
      // Reset form
      setSelectedUser(null)
      setRifaAmount([1])
      setRifaInputValue("1")
      setDescription("")
      
      // Refetch data
      queryClient.invalidateQueries({ queryKey: ['users-for-rifa-distribution'] })
    },
    onError: (error) => {
      toast({
        title: "Erro ao distribuir rifas",
        description: error.message,
        variant: "destructive"
      })
    }
  })

  const handleDistributeRifas = () => {
    if (!selectedUser) {
      toast({
        title: "Usuário não selecionado",
        description: "Selecione um usuário para distribuir rifas",
        variant: "destructive"
      })
      return
    }

    const amount = parseInt(rifaInputValue) || rifaAmount[0]
    if (amount <= 0) {
      toast({
        title: "Quantidade inválida",
        description: "A quantidade de rifas deve ser maior que zero",
        variant: "destructive"
      })
      return
    }

    distributeMutation.mutate({
      userId: selectedUser.id,
      amount,
      description
    })
  }

  const handleSliderChange = (value: number[]) => {
    setRifaAmount(value)
    setRifaInputValue(value[0].toString())
  }

  const handleInputChange = (value: string) => {
    setRifaInputValue(value)
    const numValue = parseInt(value) || 1
    setRifaAmount([Math.max(1, Math.min(10000, numValue))])
  }

  // Os usuários já vêm filtrados do hook
  const filteredUsers = users

  if (error) {
    return (
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
          <AdminSidebar />
          <SidebarInset className="overflow-y-auto pb-20 fancy-scrollbar">
            <div className="container px-4 py-6 sm:py-8 mx-auto max-w-7xl">
              <DashboardHeader 
                title="Rifas" 
                subtitle="Distribuição de rifas para participantes e anunciantes" 
              />
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center space-x-2 text-red-500">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Erro ao carregar usuários: {error.message}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdminSidebar />
        <SidebarInset className="overflow-y-auto pb-20 fancy-scrollbar">
          <div className="container px-4 py-6 sm:py-8 mx-auto max-w-7xl">
            <DashboardHeader 
              title="Rifas" 
              subtitle="Distribuição de rifas para participantes e anunciantes" 
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 sm:mt-8 space-y-4"
            >
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.user_type === 'participante').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anunciantes</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.user_type === 'anunciante').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Lista de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Colaborador</CardTitle>
            <CardDescription>
              Escolha um participante ou anunciante para distribuir rifas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filtros */}
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="participante">Participantes</SelectItem>
                  <SelectItem value="anunciante">Anunciantes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lista de usuários */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {isLoading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Carregando usuários...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhum usuário encontrado
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                      selectedUser?.id === user.id ? 'bg-accent border-primary' : ''
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium truncate">
                            {user.full_name || 'Nome não informado'}
                          </p>
                          <Badge variant={user.user_type === 'anunciante' ? 'default' : 'secondary'}>
                            {user.user_type === 'anunciante' ? 'Anunciante' : 'Participante'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                        {user.company_name && (
                          <p className="text-xs text-muted-foreground truncate">
                            {user.company_name}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {user.user_type === 'anunciante' 
                            ? user.advertiser_rifas?.toLocaleString() || '0'
                            : user.rifas?.toLocaleString() || '0'
                          } rifas
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Formulário de Distribuição */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuir Rifas</CardTitle>
            <CardDescription>
              Configure a quantidade de rifas para distribuir
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedUser ? (
              <>
                {/* Usuário Selecionado */}
                <div className="p-4 bg-accent rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Gift className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">{selectedUser.full_name}</p>
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={selectedUser.user_type === 'anunciante' ? 'default' : 'secondary'}>
                          {selectedUser.user_type === 'anunciante' ? 'Anunciante' : 'Participante'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {selectedUser.user_type === 'anunciante' 
                            ? selectedUser.advertiser_rifas?.toLocaleString() || '0'
                            : selectedUser.rifas?.toLocaleString() || '0'
                          } rifas atuais
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Controles de Quantidade */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Quantidade de Rifas: {rifaAmount[0].toLocaleString()}
                    </label>
                    <Slider
                      value={rifaAmount}
                      onValueChange={handleSliderChange}
                      min={1}
                      max={10000}
                      step={1}
                      className="mb-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Valor Específico
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="10000"
                      value={rifaInputValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder="Digite a quantidade"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Descrição (Opcional)
                    </label>
                    <Input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Motivo da distribuição..."
                    />
                  </div>
                </div>

                <Separator />

                {/* Resumo e Ação */}
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Resumo da Distribuição</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Usuário:</span>
                        <span>{selectedUser.full_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rifas atuais:</span>
                        <span>
                          {selectedUser.user_type === 'anunciante' 
                            ? selectedUser.advertiser_rifas?.toLocaleString() || '0'
                            : selectedUser.rifas?.toLocaleString() || '0'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rifas a distribuir:</span>
                        <span>+{rifaAmount[0].toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total após distribuição:</span>
                        <span>
                          {(
                            (selectedUser.user_type === 'anunciante' 
                              ? selectedUser.advertiser_rifas || 0
                              : selectedUser.rifas || 0
                            ) + rifaAmount[0]
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleDistributeRifas}
                    disabled={distributeMutation.isPending}
                    className="w-full"
                    size="lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {distributeMutation.isPending ? 'Distribuindo...' : 'Distribuir Rifas'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Selecione um colaborador na lista ao lado para começar a distribuição de rifas
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
            </motion.div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default RifasManagementPage 