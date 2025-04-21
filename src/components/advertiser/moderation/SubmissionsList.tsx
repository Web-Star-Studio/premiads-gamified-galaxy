
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SubmissionCard from "./SubmissionCard";
import SubmissionsLoading from "./SubmissionsLoading";
import SubmissionsEmptyState from "./SubmissionsEmptyState";
import { useSubmissions } from "@/hooks/useSubmissions";

interface SubmissionsListProps {
  filterStatus: string;
  searchQuery: string;
  tabValue: 'pending' | 'approved' | 'rejected';
}

const SubmissionsList = ({ filterStatus, searchQuery, tabValue }: SubmissionsListProps) => {
  const { submissions, loading, handleRemoveSubmission } = useSubmissions({
    filterStatus,
    searchQuery,
    tabValue
  });
  
  if (loading) {
    return <SubmissionsLoading />;
  }
  
  if (submissions.length === 0) {
    return <SubmissionsEmptyState tabValue={tabValue} />;
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>
          {tabValue === 'pending' 
            ? "Submissões Pendentes"
            : tabValue === 'approved'
              ? "Submissões Aprovadas"
              : "Submissões Rejeitadas"
          }
          <span className="text-neon-cyan ml-2">({submissions.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {submissions.map((submission) => (
            <SubmissionCard 
              key={submission.id}
              submission={submission}
              mode={tabValue}
              onRemove={handleRemoveSubmission}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionsList;
