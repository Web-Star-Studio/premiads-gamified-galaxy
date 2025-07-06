import { useCallback } from 'react'
import { useToast } from "@/hooks/use-toast"
import { useSounds } from "@/hooks/use-sounds"

export interface CampaignAnalyticsData {
  id: string
  name: string
  status: string
  submissions: number
  approved: number
  pending: number
  rejected: number
  approvalRate: number
}

export function useCampaignExport() {
  const { toast } = useToast()
  const { playSound } = useSounds()

  const exportToCsv = useCallback((data: CampaignAnalyticsData[] | undefined, fileName: string = 'analise-campanhas') => {
    if (!data || data.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Não há dados de campanha disponíveis para gerar o arquivo CSV.",
        variant: "destructive",
      })
      playSound("error")
      return
    }

    try {
      // Headers mais detalhados para análise
      const headers = [
        "ID da Campanha",
        "Nome da Campanha",
        "Status",
        "Total de Participações",
        "Participações Aprovadas",
        "Participações Pendentes",
        "Participações Rejeitadas",
        "Taxa de Aprovação (%)",
        "Taxa de Rejeição (%)",
        "Taxa de Pendência (%)",
        "Performance Geral"
      ]

      // Gerar linhas de dados com cálculos adicionais
      const csvRows = data.map(item => {
        const rejectionRate = item.submissions > 0 
          ? Math.round((item.rejected / item.submissions) * 100) 
          : 0
        
        const pendingRate = item.submissions > 0 
          ? Math.round((item.pending / item.submissions) * 100) 
          : 0

        // Classificação de performance baseada na taxa de aprovação
        let performance = "Sem dados"
        if (item.submissions > 0) {
          if (item.approvalRate >= 80) performance = "Excelente"
          else if (item.approvalRate >= 60) performance = "Boa"
          else if (item.approvalRate >= 40) performance = "Regular"
          else performance = "Baixa"
        }

        return [
          item.id,
          `"${item.name.replace(/"/g, '""')}"`, // Escape quotes in campaign names
          item.status,
          item.submissions,
          item.approved,
          item.pending,
          item.rejected,
          item.approvalRate,
          rejectionRate,
          pendingRate,
          performance
        ].join(',')
      })

      // Adicionar resumo estatístico no final
      const totalSubmissions = data.reduce((sum, item) => sum + item.submissions, 0)
      const totalApproved = data.reduce((sum, item) => sum + item.approved, 0)
      const totalPending = data.reduce((sum, item) => sum + item.pending, 0)
      const totalRejected = data.reduce((sum, item) => sum + item.rejected, 0)
      const overallApprovalRate = totalSubmissions > 0 
        ? Math.round((totalApproved / totalSubmissions) * 100) 
        : 0

      // Calcular estatísticas adicionais
      const avgSubmissionsPerCampaign = data.length > 0 
        ? Math.round(totalSubmissions / data.length) 
        : 0
      
      const activeCampaigns = data.filter(item => item.status === 'ativa' || item.status === 'active').length
      const campaignsWithSubmissions = data.filter(item => item.submissions > 0).length

      // Adicionar linhas de resumo mais detalhadas
      const summaryRows = [
        '',
        '"=== RESUMO GERAL ==="',
        '"Total de Campanhas",' + data.length,
        '"Campanhas Ativas",' + activeCampaigns,
        '"Campanhas com Participações",' + campaignsWithSubmissions,
        '"Total de Participações",' + totalSubmissions,
        '"Média de Participações por Campanha",' + avgSubmissionsPerCampaign,
        '',
        '"=== ANÁLISE DE PARTICIPAÇÕES ==="',
        '"Total Aprovadas",' + totalApproved,
        '"Total Pendentes",' + totalPending,
        '"Total Rejeitadas",' + totalRejected,
        '"Taxa de Aprovação Geral (%)",' + overallApprovalRate,
        '"Taxa de Rejeição Geral (%)",' + (totalSubmissions > 0 ? Math.round((totalRejected / totalSubmissions) * 100) : 0),
        '"Taxa de Pendência Geral (%)",' + (totalSubmissions > 0 ? Math.round((totalPending / totalSubmissions) * 100) : 0),
        '',
        '"=== INFORMAÇÕES DO RELATÓRIO ==="',
        '"Data de Geração",' + new Date().toLocaleString('pt-BR'),
        '"Período de Análise","Todas as campanhas"',
        '"Sistema","PremiAds Gamified Galaxy"'
      ]

      // Combinar headers, dados e resumo
      const csvContent = [
        headers.join(','),
        ...csvRows,
        ...summaryRows
      ].join('\n')

      // Criar e baixar arquivo
      const blob = new Blob(['\uFEFF' + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      }) // BOM para UTF-8 no Excel
      
      const link = document.createElement("a")
      if (link.href) {
        URL.revokeObjectURL(link.href)
      }
      
      link.href = URL.createObjectURL(blob)
      const timestamp = new Date().toISOString().split('T')[0]
      link.setAttribute("download", `${fileName}_${timestamp}.csv`)
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Cleanup URL object
      setTimeout(() => {
        URL.revokeObjectURL(link.href)
      }, 100)

      toast({
        title: "Exportação Concluída",
        description: `Análise de ${data.length} campanhas exportada com sucesso. O arquivo inclui dados detalhados e resumo estatístico completo.`,
      })
      playSound("success")
      
      // Log para debugging
      console.log(`[CampaignExport] Successfully exported ${data.length} campaigns with ${totalSubmissions} total submissions`)
      
    } catch (error) {
      console.error("Failed to export CSV:", error)
      toast({
        title: "Erro na Exportação",
        description: "Ocorreu um erro ao tentar exportar os dados da campanha. Tente novamente.",
        variant: "destructive",
      })
      playSound("error")
    }
  }, [toast, playSound])

  return { exportToCsv }
} 