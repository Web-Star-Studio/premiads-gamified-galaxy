import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Clock, CreditCard, QrCode } from 'lucide-react'
import { motion } from 'framer-motion'

function PagamentoMockPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending')
  const [countdown, setCountdown] = useState(3)

  const provider = searchParams.get('provider')
  const method = searchParams.get('method')
  const purchaseId = searchParams.get('purchase_id')
  const hasError = searchParams.get('error') === 'true'

  const methodNames = {
    pix: 'PIX',
    credit_card: 'Cartão de Crédito',
    boleto: 'Boleto Bancário'
  }

  const getMethodIcon = () => {
    switch (method) {
      case 'pix':
        return <QrCode className="w-6 h-6" />
      case 'credit_card':
        return <CreditCard className="w-6 h-6" />
      default:
        return <CreditCard className="w-6 h-6" />
    }
  }

  useEffect(() => {
    if (hasError) {
      setStatus('error')
      return
    }

    // Simular processamento
    setStatus('processing')
    
    const timer = setTimeout(() => {
      setStatus('success')
      
      // Countdown para redirecionamento
      const countdownTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer)
            navigate('/anunciante/pagamento-sucesso?mock=true&purchase_id=' + purchaseId)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, 2000)

    return () => clearTimeout(timer)
  }, [hasError, navigate, purchaseId])

  const handleContinue = () => {
    if (status === 'success') {
      navigate('/anunciante/pagamento-sucesso?mock=true&purchase_id=' + purchaseId)
    } else if (status === 'error') {
      navigate('/anunciante/creditos')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-galaxy-deepPurple via-galaxy-darkPurple to-black p-4">
      <div className="max-w-md mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-galaxy-deepPurple/50 border-galaxy-purple/30 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-galaxy-accent flex items-center justify-center gap-2">
                {getMethodIcon()}
                Simulação Mercado Pago
              </CardTitle>
              <p className="text-galaxy-lightGray text-sm">
                Pagamento via {methodNames[method as keyof typeof methodNames] || method}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Status do Pagamento */}
              <div className="text-center">
                {status === 'pending' && (
                  <div className="space-y-2">
                    <Clock className="w-12 h-12 text-galaxy-accent mx-auto animate-pulse" />
                    <p className="text-white">Iniciando pagamento...</p>
                  </div>
                )}
                
                {status === 'processing' && (
                  <div className="space-y-2">
                    <div className="w-12 h-12 border-4 border-galaxy-accent border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-white">Processando pagamento...</p>
                    <p className="text-galaxy-lightGray text-sm">
                      Aguarde enquanto confirmamos seu pagamento
                    </p>
                  </div>
                )}
                
                {status === 'success' && (
                  <div className="space-y-2">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                    <p className="text-white font-semibold">Pagamento Aprovado!</p>
                    <p className="text-galaxy-lightGray text-sm">
                      Redirecionando em {countdown} segundos...
                    </p>
                  </div>
                )}
                
                {status === 'error' && (
                  <div className="space-y-2">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                    <p className="text-white font-semibold">Erro no Pagamento</p>
                    <p className="text-galaxy-lightGray text-sm">
                      Falha na integração com Mercado Pago
                    </p>
                  </div>
                )}
              </div>

              {/* Informações do Mock */}
              <div className="bg-galaxy-purple/20 rounded-lg p-4 text-center">
                <p className="text-galaxy-accent text-sm font-medium mb-1">
                  🚧 Modo Desenvolvimento
                </p>
                <p className="text-galaxy-lightGray text-xs">
                  Esta é uma simulação. Configure MERCADO_PAGO_ACCESS_TOKEN 
                  para integração real.
                </p>
              </div>

              {/* Detalhes da Transação */}
              {purchaseId && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-galaxy-lightGray">ID da Compra:</span>
                    <span className="text-white font-mono">{purchaseId.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-galaxy-lightGray">Provedor:</span>
                    <span className="text-white">Mercado Pago (Mock)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-galaxy-lightGray">Método:</span>
                    <span className="text-white">{methodNames[method as keyof typeof methodNames] || method}</span>
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              {(status === 'success' || status === 'error') && (
                <Button 
                  onClick={handleContinue}
                  className="w-full bg-galaxy-accent hover:bg-galaxy-accent/80 text-black font-semibold"
                >
                  {status === 'success' ? 'Continuar' : 'Tentar Novamente'}
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default PagamentoMockPage 