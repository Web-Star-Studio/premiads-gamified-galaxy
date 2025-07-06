import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Users, 
  Target, 
  MessageSquare, 
  Trophy,
  Activity,
  Clock,
  Edit2,
  Save,
  X
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { useMediaQuery } from '@/hooks/use-mobile'
import AdminSidebar from '@/components/admin/AdminSidebar'
import DashboardHeader from '@/components/admin/DashboardHeader'
import { AdminAvatarUploader } from '@/components/admin/AdminAvatarUploader'
import { useAdminProfile } from '@/hooks/admin/useAdminProfile'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const AdminProfilePage = () => {
  const { profileData, systemMetrics, loading, updateProfile } = useAdminProfile()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: ''
  })

  const handleEditStart = () => {
    if (profileData) {
      setEditForm({
        full_name: profileData.full_name
      })
      setIsEditing(true)
    }
  }

  const handleEditSave = async () => {
    const success = await updateProfile(editForm)
    if (success) {
      setIsEditing(false)
    }
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    setEditForm({
      full_name: ''
    })
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true, 
      locale: ptBR 
    })
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-galaxy-dark via-galaxy-darkPurple to-galaxy-dark p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-galaxy-dark via-galaxy-darkPurple to-galaxy-dark p-6 flex items-center justify-center">
        <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Erro ao carregar perfil</h2>
            <p className="text-gray-400">Não foi possível carregar os dados do perfil.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdminSidebar />
        <SidebarInset className="overflow-y-auto pb-20 fancy-scrollbar">
          <div className="container px-4 py-6 sm:py-8 mx-auto max-w-7xl">
            <DashboardHeader 
              title="Perfil do Administrador" 
              subtitle="Gerencie suas informações e visualize métricas do sistema" 
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 sm:mt-8"
            >

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24 border-4 border-neon-pink/30">
                    {profileData.avatar_url ? (
                      <AvatarImage src={profileData.avatar_url} alt={profileData.full_name} />
                    ) : (
                      <AvatarFallback className="bg-galaxy-purple text-2xl text-white">
                        {getInitials(profileData.full_name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="full_name" className="text-white">Nome Completo</Label>
                      <Input
                        id="full_name"
                        value={editForm.full_name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                        className="bg-galaxy-dark border-galaxy-purple/30 text-white"
                      />
                    </div>
                    <AdminAvatarUploader
                      currentAvatar={profileData.avatar_url}
                      adminId={profileData.id}
                      adminName={profileData.full_name}
                      onAvatarUpdate={(newAvatarUrl) => {
                        // Trigger a refresh of the profile data
                        window.location.reload()
                      }}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleEditSave} size="sm" className="bg-neon-cyan hover:bg-neon-cyan/80">
                        <Save className="w-4 h-4 mr-2" />
                        Salvar
                      </Button>
                      <Button onClick={handleEditCancel} size="sm" variant="outline">
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-white text-xl">{profileData.full_name}</CardTitle>
                    <p className="text-gray-400">Administrador do Sistema</p>
                    <Button onClick={handleEditStart} size="sm" variant="outline" className="mt-4">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Editar Perfil
                    </Button>
                  </>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-4 h-4 text-neon-cyan" />
                  <span className="text-sm">{profileData.email}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-300">
                  <User className="w-4 h-4 text-neon-pink" />
                  <span className="text-sm">ID: {profileData.id.slice(0, 8)}...</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span className="text-sm">Criado {formatDate(profileData.created_at)}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span className="text-sm">Último login {formatDate(profileData.last_sign_in_at)}</span>
                </div>
                
                <Separator className="bg-galaxy-purple/30" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Status</span>
                  <Badge variant={profileData.active ? "default" : "secondary"}>
                    {profileData.active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Rifas</span>
                  <Badge variant="outline" className="border-neon-cyan text-neon-cyan">
                    {profileData.rifas.toLocaleString()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-neon-cyan" />
                  Métricas do Sistema
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {systemMetrics ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-galaxy-dark/50 p-4 rounded-lg border border-galaxy-purple/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-gray-400">Usuários</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{systemMetrics.total_users}</p>
                    </div>
                    
                    <div className="bg-galaxy-dark/50 p-4 rounded-lg border border-galaxy-purple/20">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-400">Clientes</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{systemMetrics.total_clients}</p>
                    </div>
                    
                    <div className="bg-galaxy-dark/50 p-4 rounded-lg border border-galaxy-purple/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-gray-400">Anunciantes</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{systemMetrics.total_advertisers}</p>
                    </div>
                    
                    <div className="bg-galaxy-dark/50 p-4 rounded-lg border border-galaxy-purple/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-orange-400" />
                        <span className="text-sm text-gray-400">Missões Ativas</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{systemMetrics.active_missions}</p>
                    </div>
                    
                    <div className="bg-galaxy-dark/50 p-4 rounded-lg border border-galaxy-purple/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">Rifas</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{systemMetrics.total_raffles}</p>
                    </div>
                    
                    <div className="bg-galaxy-dark/50 p-4 rounded-lg border border-galaxy-purple/20">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-pink-400" />
                        <span className="text-sm text-gray-400">Submissões</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{systemMetrics.total_submissions}</p>
                    </div>
                    
                    <div className="bg-galaxy-dark/50 p-4 rounded-lg border border-galaxy-purple/20">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-gray-400">Notificações</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{systemMetrics.total_notifications}</p>
                    </div>
                    
                    <div className="bg-galaxy-dark/50 p-4 rounded-lg border border-galaxy-purple/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-neon-pink" />
                        <span className="text-sm text-gray-400">Nível de Acesso</span>
                      </div>
                      <p className="text-lg font-bold text-neon-pink">TOTAL</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
            </motion.div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default AdminProfilePage 