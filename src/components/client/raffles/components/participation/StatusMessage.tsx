
import React from 'react';
import { AlertTriangle, Clock } from "lucide-react";

interface ClosedMessageProps {
  isVisible: boolean;
}

export const ClosedMessage = ({ isVisible }: ClosedMessageProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="bg-amber-500/10 p-3 rounded-md border border-amber-500/20 text-sm">
      <div className="flex items-center">
        <Clock className="w-4 h-4 text-amber-500 mr-2" />
        <span>Este sorteio ocorrerá em menos de 1 hora e não aceita mais participações</span>
      </div>
    </div>
  );
};

interface ParticipationMessageProps {
  isVisible: boolean;
  count: number;
}

export const ParticipationMessage = ({ isVisible, count }: ParticipationMessageProps) => {
  if (!isVisible || count <= 0) return null;
  
  return (
    <div className="bg-galaxy-deepPurple/50 p-3 rounded-md border border-neon-cyan/20 text-sm">
      <div className="flex items-center">
        <AlertTriangle className="w-4 h-4 text-neon-cyan mr-2" />
        <span>Você já está participando com <span className="text-neon-cyan">{count} ticket(s)</span></span>
      </div>
    </div>
  );
};
