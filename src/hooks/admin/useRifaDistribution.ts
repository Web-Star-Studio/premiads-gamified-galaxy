import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface RifaDistribution {
  userId: string
  amount: number
  description: string
}

interface UserProfile {
  id: string
  full_name: string
  email: string
  user_type: string
  rifas: number
  advertiser_rifas?: number
  company_name?: string
}

export function useRifaDistribution() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [rifaAmount, setRifaAmount] = useState([1])
  const [rifaInputValue, setRifaInputValue] = useState("1")
  const [description, setDescription] = useState("")

  const distributeMutation = useMutation({
    mutationFn: async (distribution: RifaDistribution) => {
      // Buscar dados atuais do usuário
      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('rifas, user_type')
        .eq('id', distribution.userId)
        .single()

      if (userError || !user) {
        throw new Error('Usuário não encontrado')
      }

      // Calcular novo total de rifas
      const newRifasTotal = user.rifas + distribution.amount

      // Atualizar rifas no perfil principal
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ rifas: newRifasTotal })
        .eq('id', distribution.userId)

      if (updateError) {
        throw new Error(`Erro ao atualizar perfil: ${updateError.message}`)
      }

      // Se for anunciante, atualizar também na tabela advertiser_profiles
      if (user.user_type === 'anunciante') {
        const { data: advertiserProfile, error: advertiserError } = await supabase
          .from('advertiser_profiles')
          .select('rifas')
          .eq('user_id', distribution.userId)
          .single()

        if (advertiserProfile && !advertiserError) {
          const newAdvertiserRifas = advertiserProfile.rifas + distribution.amount
          
          const { error: advertiserUpdateError } = await supabase
            .from('advertiser_profiles')
            .update({ rifas: newAdvertiserRifas })
            .eq('user_id', distribution.userId)

          if (advertiserUpdateError) {
            throw new Error(`Erro ao atualizar perfil do anunciante: ${advertiserUpdateError.message}`)
          }
        }
      }

      // Registrar transação para histórico
      const { error: transactionError } = await supabase
        .from('rifas_transactions')
        .insert({
          user_id: distribution.userId,
          transaction_type: 'bonus',
          amount: distribution.amount,
          description: distribution.description || 'Distribuição manual pelo administrador'
        })

      if (transactionError) {
        console.warn('Erro ao registrar transação:', transactionError.message)
        // Não falha a operação principal se o log falhar
      }

      return {
        ...distribution,
        newTotal: newRifasTotal
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Rifas distribuídas com sucesso!",
        description: `${data.amount.toLocaleString()} rifas foram adicionadas para ${selectedUser?.full_name}`,
      })
      
      // Reset do formulário
      resetForm()
      
      // Invalidar cache para recarregar dados
      queryClient.invalidateQueries({ queryKey: ['users-for-rifa-distribution'] })
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao distribuir rifas",
        description: error.message,
        variant: "destructive"
      })
    }
  })

  const resetForm = () => {
    setSelectedUser(null)
    setRifaAmount([1])
    setRifaInputValue("1")
    setDescription("")
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

  const distributeRifas = () => {
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

    if (amount > 10000) {
      toast({
        title: "Quantidade muito alta",
        description: "A quantidade máxima é de 10.000 rifas por distribuição",
        variant: "destructive"
      })
      return
    }

    distributeMutation.mutate({
      userId: selectedUser.id,
      amount,
      description: description.trim() || `Distribuição manual de ${amount} rifas pelo administrador`
    })
  }

  return {
    // Estado
    selectedUser,
    setSelectedUser,
    rifaAmount,
    rifaInputValue,
    description,
    setDescription,
    
    // Handlers
    handleSliderChange,
    handleInputChange,
    distributeRifas,
    resetForm,
    
    // Status da mutation
    isDistributing: distributeMutation.isPending,
    isSuccess: distributeMutation.isSuccess,
    error: distributeMutation.error?.message
  }
}

export default useRifaDistribution 