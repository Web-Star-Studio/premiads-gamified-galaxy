import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import SubmissionCard from './SubmissionCard';
import { Submission } from './ModerationContent';

export interface SubmissionsListProps {
  submissions: Submission[];
  onApprove: (submissionId: string) => Promise<void>;
  onReject: (submissionId: string, reason?: string) => Promise<void>;
}

const SubmissionsList = ({ submissions, onApprove, onReject }: SubmissionsListProps) => {
  return (
    <Card className="border-galaxy-purple bg-galaxy-darkPurple">
      <CardContent className="p-6">
        <div className="space-y-6">
          {submissions.map((submission) => (
            <SubmissionCard 
              key={submission.id}
              submission={submission}
              onApprove={() => onApprove(submission.id)}
              onReject={(reason) => onReject(submission.id, reason)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionsList;
