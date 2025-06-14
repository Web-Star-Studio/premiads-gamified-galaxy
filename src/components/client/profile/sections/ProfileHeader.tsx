import { CheckCircle } from "lucide-react";

// Define a constant for the number of rifas per profile completion
const RIFAS_PER_PROFILE_COMPLETION = 2;

interface ProfileHeaderProps {
  hasCompletedBefore: boolean;
  pointsAwarded: boolean;
}

export const ProfileHeader = ({ hasCompletedBefore, pointsAwarded }: ProfileHeaderProps) => (
    <div className="mb-6">
      <h2 className="text-2xl font-bold font-heading mb-2">Complete seu Perfil</h2>
      <p className="text-gray-400">
        Estas informações nos ajudam a encontrar as melhores missões para você. 
        {!hasCompletedBefore && ` Ganhe ${RIFAS_PER_PROFILE_COMPLETION} rifas ao completar seu perfil pela primeira vez!`}
      </p>
      
      {pointsAwarded && (
        <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-md flex items-center gap-2">
          <CheckCircle className="text-green-500 h-5 w-5" />
          <span>Parabéns! Você ganhou {RIFAS_PER_PROFILE_COMPLETION} rifas por completar seu perfil!</span>
        </div>
      )}
    </div>
  );
