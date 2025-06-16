import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminModerationContent from '@/components/admin/moderation/AdminModerationContent';

/**
 * Página de moderação para administradores
 * Permite gerenciar submissões em segunda instância
 */
function ModerationPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-galaxy-purple/20 rounded-lg">
            <Shield className="h-6 w-6 text-galaxy-purple" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Moderação de Submissões</h1>
            <p className="text-gray-400">Gerencie submissões em segunda instância</p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-amber-500/30 bg-amber-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-300">
            <AlertTriangle className="h-5 w-5" />
            Segunda Instância de Moderação
          </CardTitle>
          <CardDescription className="text-amber-200/70">
            Aqui você encontra submissões que foram rejeitadas pelos anunciantes e precisam de uma segunda avaliação administrativa.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-sm text-amber-200/60 space-y-1">
            <p>• <strong>Aprovar:</strong> Retorna a submissão para o anunciante para nova avaliação</p>
            <p>• <strong>Rejeitar:</strong> Rejeita definitivamente a submissão (participante não recebe recompensas)</p>
          </div>
        </CardContent>
      </Card>

      {/* Moderation Content */}
      <AdminModerationContent refreshKey={refreshKey} onRefresh={handleRefresh} />
    </motion.div>
  );
}

export default ModerationPage; 