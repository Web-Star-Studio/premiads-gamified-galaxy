
import { Link } from "react-router-dom";
import { User, ChevronRight, MapPin, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProfilePreviewProps {
  profileData?: any;
}

const ProfilePreview = ({ profileData }: ProfilePreviewProps) => {
  const isProfileCompleted = profileData?.profile_completed || false;
  const profileUpdatedAt = profileData?.updated_at ? new Date(profileData.updated_at) : new Date();
  
  const lastUpdated = formatDistanceToNow(profileUpdatedAt, {
    addSuffix: true,
    locale: ptBR
  });

  return (
    <div className="glass-panel rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-galaxy-blue/20 to-galaxy-purple/30 p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-neon-cyan" />
            Seu Perfil
          </h3>
          <Link 
            to="/cliente/perfil" 
            className="text-sm text-neon-cyan hover:underline flex items-center"
          >
            {isProfileCompleted ? 'Visualizar' : 'Completar'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      <div className="p-4">
        {isProfileCompleted ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-galaxy-blue flex items-center justify-center text-xl font-bold text-white">
                {profileData?.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <h4 className="font-bold text-white">{profileData?.full_name || 'Usuário'}</h4>
                <p className="text-sm text-gray-400">{profileData?.email || 'Email não informado'}</p>
              </div>
            </div>
            
            {(profileData?.profile_data?.city || profileData?.profile_data?.state) && (
              <div className="flex items-center text-sm text-gray-300 mb-2">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span>
                  {profileData?.profile_data?.city || ''} 
                  {profileData?.profile_data?.city && profileData?.profile_data?.state && ', '}
                  {profileData?.profile_data?.state || ''}
                </span>
              </div>
            )}
            
            <div className="flex items-center text-sm text-gray-300 mb-3">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span>Perfil atualizado {lastUpdated}</span>
            </div>
            
            <div className="text-sm text-gray-400">
              {profileData?.description || 'Nenhuma descrição fornecida.'}
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-galaxy-blue/30 flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-300" />
            </div>
            <h4 className="font-medium text-gray-300 mb-2">Complete seu perfil</h4>
            <p className="text-sm text-gray-400 mb-4">Ganhe tickets e desbloqueie funcionalidades adicionais</p>
            <Link 
              to="/cliente/perfil" 
              className="inline-block bg-galaxy-purple/30 border border-neon-cyan/30 text-white px-4 py-2 rounded-md hover:bg-galaxy-purple/50 transition-colors"
            >
              Completar perfil
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePreview;
