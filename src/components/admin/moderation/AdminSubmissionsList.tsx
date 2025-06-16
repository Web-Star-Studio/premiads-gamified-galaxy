import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import AdminSubmissionCard from './AdminSubmissionCard';
import { Submission } from '@/types/missions';
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export interface AdminSubmissionsListProps {
  submissions: Submission[];
  onApprove: (submission: Submission) => Promise<void>;
  onReject: (submission: Submission, reason?: string) => Promise<void>;
}

/**
 * Lista de submissões para moderação administrativa
 * Exibe submissões em segunda instância que precisam de avaliação do admin
 */
function AdminSubmissionsList({ submissions, onApprove, onReject }: AdminSubmissionsListProps) {
  return (
    <Card className="border-galaxy-purple bg-galaxy-darkPurple">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header info */}
          <div className="flex items-center mb-4 bg-amber-950/30 p-3 rounded-md border border-amber-500/30">
            <AlertTriangle className="h-5 w-5 text-amber-300 mr-2" />
            <Badge variant="outline" className="text-amber-300 border-amber-500/30 mr-3">
              Segunda Instância
            </Badge>
            <span className="text-sm text-amber-300/70">
              Submissões rejeitadas pelos anunciantes que precisam de avaliação administrativa.
            </span>
          </div>
          
          {/* Submissions list */}
          <div className="space-y-4">
            {submissions.map((submission) => (
              <AdminSubmissionCard 
                key={submission.id}
                submission={submission}
                onApprove={() => onApprove(submission)}
                onReject={(reason) => onReject(submission, reason)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminSubmissionsList; 