import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import SubmissionCard from './SubmissionCard';
import { Submission } from '@/types/missions';
import { Badge } from "@/components/ui/badge";
import { RotateCcw } from "lucide-react";

export interface SubmissionsListProps {
  submissions: Submission[];
  onApprove: (submission: Submission) => Promise<void>;
  onReject: (submission: Submission, reason?: string) => Promise<void>;
}

const SubmissionsList = ({ submissions, onApprove, onReject }: SubmissionsListProps) => {
  // Group submissions by status type
  const pendingSubmissions = submissions.filter(s => s.status === 'pending_approval');
  const returnedSubmissions = submissions.filter(s => s.status === 'returned_to_advertiser');
  const secondInstanceSubmissions = submissions.filter(s => s.status === 'second_instance_pending');
  const otherSubmissions = submissions.filter(s => 
    s.status !== 'pending_approval' && 
    s.status !== 'returned_to_advertiser' && 
    s.status !== 'second_instance_pending'
  );
  
  return (
    <Card className="border-galaxy-purple bg-galaxy-darkPurple">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Highlight returned submissions first */}
          {returnedSubmissions.length > 0 && (
            <div>
              <div className="flex items-center mb-3 bg-amber-950/30 p-2 rounded-md border border-amber-500/30">
                <Badge variant="outline" className="text-amber-300 border-amber-500/30">
                  Retornadas pelo Administrador
                </Badge>
                <span className="text-xs text-amber-300/70 ml-2">
                  O administrador aprovou estas submissões em segunda instância e retornou para sua revisão final.
                </span>
              </div>
              
              <div className="space-y-4">
                {returnedSubmissions.map((submission) => (
                  <SubmissionCard 
                    key={submission.id}
                    submission={submission}
                    onApprove={() => onApprove(submission)}
                    onReject={(reason) => onReject(submission, reason)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Then show pending submissions */}
          {pendingSubmissions.length > 0 && (
            <div>
              {returnedSubmissions.length > 0 && (
                <div className="flex items-center mb-3 mt-6">
                  <Badge variant="outline" className="bg-galaxy-deeper border-galaxy-purple/30">
                    Submissões Pendentes
                  </Badge>
                </div>
              )}
              
              <div className="space-y-4">
                {pendingSubmissions.map((submission) => (
                  <SubmissionCard 
                    key={submission.id}
                    submission={submission}
                    onApprove={() => onApprove(submission)}
                    onReject={(reason) => onReject(submission, reason)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Show submissions in second instance */}
          {secondInstanceSubmissions.length > 0 && (
            <div>
              <div className="flex items-center mb-3 mt-6 bg-galaxy-deeper/80 p-2 rounded-md border border-neon-pink/20">
                <RotateCcw className="text-neon-pink mr-2 h-4 w-4" />
                <span className="text-xs text-neon-pink/90">
                  Estas submissões estão em análise pela equipe administrativa em segunda instância
                </span>
              </div>
              
              <div className="space-y-4">
                {secondInstanceSubmissions.map((submission) => (
                  <SubmissionCard 
                    key={submission.id}
                    submission={submission}
                    onApprove={() => onApprove(submission)}
                    onReject={(reason) => onReject(submission, reason)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Finally show other submissions */}
          {otherSubmissions.length > 0 && (
            <div>
              <div className="flex items-center mb-3 mt-6">
                <Badge variant="outline" className="bg-galaxy-deeper border-galaxy-purple/30">
                  Outras Submissões
                </Badge>
              </div>
              
              <div className="space-y-4">
                {otherSubmissions.map((submission) => (
                  <SubmissionCard 
                    key={submission.id}
                    submission={submission}
                    onApprove={() => onApprove(submission)}
                    onReject={(reason) => onReject(submission, reason)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionsList;
