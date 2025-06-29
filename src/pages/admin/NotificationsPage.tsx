import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Switch } from '../../components/ui/switch'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Separator } from '../../components/ui/separator'
import { Badge } from '../../components/ui/badge'
import { Send, Settings, History, Bell, Users, Globe, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAdminNotifications, type SendNotificationData } from '../../hooks/admin/useAdminNotifications'
import { useToast } from '../../hooks/use-toast'
import { SidebarProvider, SidebarInset } from '../../components/ui/sidebar'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'

function NotificationsPage() {
  const navigate = useNavigate()
  const {
    isLoading,
    settings,
    notifications,
    pagination,
    sendNotification,
    getSettings,
    updateSettings,
    getNotificationsHistory,
    toggleSetting
  } = useAdminNotifications()

  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState<SendNotificationData>({
    title: '',
    message: '',
    target_type: 'all'
  })

  // UI state
  const [activeTab, setActiveTab] = useState<'send' | 'settings' | 'history'>('send')
  const [currentPage, setCurrentPage] = useState(1)
  const [historyFilter, setHistoryFilter] = useState<'all' | 'anunciante' | 'participante'>('all')

  // Load initial data
  useEffect(() => {
    console.log('NotificationsPage - Loading settings...')
    getSettings().then(result => {
      console.log('NotificationsPage - Settings result:', result)
    }).catch(error => {
      console.error('NotificationsPage - Settings error:', error)
    })
  }, [getSettings])

  // Load history only when history tab is active or filter changes
  useEffect(() => {
    if (activeTab === 'history') {
      console.log('NotificationsPage - Loading history with filter:', historyFilter)
      getNotificationsHistory(1, 10, historyFilter).then(result => {
        console.log('NotificationsPage - History result:', result)
      }).catch(error => {
        console.error('NotificationsPage - History error:', error)
      })
    }
  }, [activeTab, historyFilter, getNotificationsHistory])

  const handleSendNotification = async () => {
    if (!formData.title || !formData.message) {
      toast({
        title: 'Erro de validação',
        description: 'Título e mensagem são obrigatórios',
        variant: 'destructive'
      })
      return
    }

    const result = await sendNotification(formData)
    
    if (result.success) {
      // Clear form and refresh history
      setFormData({ title: '', message: '', target_type: 'all' })
      getNotificationsHistory(1, 10)
      setCurrentPage(1)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    getNotificationsHistory(page, 10, historyFilter)
  }

  const getTargetTypeLabel = (targetType: string) => {
    switch (targetType) {
      case 'all': return 'Todos os usuários'
      case 'advertisers': return 'Anunciantes'
      case 'participants': return 'Participantes'
      default: return targetType
    }
  }

  const getTargetTypeColor = (targetType: string) => {
    switch (targetType) {
      case 'all': return 'bg-blue-500'
      case 'advertisers': return 'bg-green-500'
      case 'participants': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdminSidebar />
        <SidebarInset className="overflow-y-auto pb-20 fancy-scrollbar">
          <AdminHeader />
          
          <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="hover:bg-galaxy-purple/20"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">Notificações</h1>
                  <p className="text-muted-foreground">
                    Gerencie notificações e configurações do sistema
                  </p>
                </div>
              </div>
            </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 rounded-lg bg-muted p-1">
        <Button
          variant={activeTab === 'send' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('send')}
          className="flex items-center gap-2 flex-1"
        >
          <Send className="h-4 w-4" />
          Enviar Notificação
        </Button>
        <Button
          variant={activeTab === 'settings' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-2 flex-1"
        >
          <Settings className="h-4 w-4" />
          Configurações
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('history')}
          className="flex items-center gap-2 flex-1"
        >
          <History className="h-4 w-4" />
          Histórico
        </Button>
      </div>

      {/* Send Notification Tab */}
      {activeTab === 'send' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Enviar Notificação
            </CardTitle>
            <CardDescription>
              Envie notificações personalizadas para usuários específicos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Digite o título da notificação"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="target">Destinatários</Label>
                <Select 
                  value={formData.target_type} 
                  onValueChange={(value: 'all' | 'advertisers' | 'participants') => 
                    setFormData(prev => ({ ...prev, target_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o público-alvo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Todos os usuários
                      </div>
                    </SelectItem>
                    <SelectItem value="advertisers">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Anunciantes
                      </div>
                    </SelectItem>
                    <SelectItem value="participants">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Participantes
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                placeholder="Digite a mensagem da notificação..."
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              />
            </div>

            <Button 
              onClick={handleSendNotification}
              disabled={isLoading}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? 'Enviando...' : 'Enviar Notificação'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações de Notificação
                    </CardTitle>
                    <CardDescription>
              Controle global das notificações do sistema
                    </CardDescription>
                  </CardHeader>
          <CardContent className="space-y-6">
            {settings && (
              <>
                      <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Notificações Globais</Label>
                          <p className="text-sm text-muted-foreground">
                      Habilita ou desabilita todas as notificações do sistema
                          </p>
                        </div>
                        <Switch 
                    checked={settings.global_notifications_enabled}
                    onCheckedChange={() => toggleSetting('global_notifications_enabled')}
                    disabled={isLoading}
                        />
                      </div>

                <Separator />
                      
                      <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Notificações de Usuários</Label>
                          <p className="text-sm text-muted-foreground">
                      Controla notificações relacionadas a ações de usuários
                          </p>
                        </div>
                        <Switch 
                    checked={settings.user_notifications_enabled}
                    onCheckedChange={() => toggleSetting('user_notifications_enabled')}
                    disabled={isLoading || !settings.global_notifications_enabled}
                        />
                      </div>

                <Separator />
                      
                      <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Notificações de Sistema</Label>
                          <p className="text-sm text-muted-foreground">
                      Controla notificações automáticas do sistema
                          </p>
                        </div>
                        <Switch 
                    checked={settings.system_notifications_enabled}
                    onCheckedChange={() => toggleSetting('system_notifications_enabled')}
                    disabled={isLoading || !settings.global_notifications_enabled}
                        />
                      </div>
              </>
            )}
                  </CardContent>
                </Card>
      )}
                
      {/* History Tab */}
      {activeTab === 'history' && (
        <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
                      Histórico de Notificações
                    </CardTitle>
                    <CardDescription>
              Visualize todas as notificações enviadas pelo sistema administrativo
                    </CardDescription>
                    
                    {/* Filter by target type */}
                    <div className="flex items-center gap-2 pt-4">
                      <Label htmlFor="history-filter" className="text-sm font-medium">
                        Filtrar por destinatário:
                      </Label>
                      <Select value={historyFilter} onValueChange={(value: 'all' | 'anunciante' | 'participante') => setHistoryFilter(value)}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              Todos os tipos
                            </div>
                          </SelectItem>
                          <SelectItem value="anunciante">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Apenas Anunciantes
                            </div>
                          </SelectItem>
                          <SelectItem value="participante">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Apenas Participantes
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhuma notificação encontrada</p>
                </div>
              ) : (
                <>
                  {notifications.map((notification) => (
                    <div key={notification.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{notification.title}</h3>
                            <Badge 
                              variant="secondary" 
                              className={`${getTargetTypeColor(notification.data?.target_type)} text-white`}
                            >
                              {getTargetTypeLabel(notification.data?.target_type)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          {format(new Date(notification.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </div>
                      </div>
                      
                      {notification.data?.recipients_count && (
                        <div className="text-xs text-muted-foreground">
                          Enviado para {notification.data.recipients_count} usuário(s)
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Pagination */}
                  {pagination && pagination.pages > 1 && (
                    <div className="flex items-center justify-center space-x-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isLoading}
                      >
                        Anterior
                    </Button>
                      
                      <span className="text-sm text-muted-foreground">
                        Página {currentPage} de {pagination.pages}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.pages || isLoading}
                      >
                        Próxima
                      </Button>
                    </div>
                  )}
                </>
              )}
                  </div>
                </CardContent>
              </Card>
      )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default NotificationsPage
