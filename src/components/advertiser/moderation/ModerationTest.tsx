
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { missionService } from "@/services/supabase";
import { RotateCcw, ShieldAlert, Wrench, Info } from "lucide-react";

interface ModerationTestProps {
  onRefresh: () => void;
}

const ModerationTest = ({ onRefresh }: ModerationTestProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  // Cria uma submissão de teste para demonstrar o fluxo de moderação
  const createTestSubmission = async () => {
    if (!currentUser?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado para criar uma submissão de teste.",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Busca as missões deste anunciante
      const { data: missions, error: missionsError } = await missionService.supabase
        .from('missions')
        .select('id')
        .eq('created_by', currentUser.id)
        .limit(1);
      
      if (missionsError) throw missionsError;
      
      if (!missions || missions.length === 0) {
        toast({
          title: "Sem missões",
          description: "Você precisa criar pelo menos uma campanha antes de testar a moderação.",
          variant: "destructive"
        });
        return;
      }
      
      // Cria uma submissão de teste
      const missionId = missions[0].id;
      const { data: submission, error: submissionError } = await missionService.supabase
        .from('mission_submissions')
        .insert({
          mission_id: missionId,
          user_id: currentUser.id, // Usa o próprio anunciante como usuário para teste
          status: 'pending',
          proof_text: 'Esta é uma submissão de teste para demonstrar o fluxo de moderação.',
          submission_data: { test_data: true, message: 'Submissão para demonstração do fluxo de moderação.' },
          submitted_at: new Date().toISOString(),
          review_stage: 'first_review'
        })
        .select()
        .single();
      
      if (submissionError) throw submissionError;
      
      toast({
        title: "Submissão de teste criada",
        description: "Uma nova submissão de teste foi criada para você moderar.",
      });
      
      // Notifica o componente pai para atualizar a lista
      onRefresh();
      
    } catch (error: any) {
      console.error('Erro ao criar submissão de teste:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar a submissão de teste.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  // Cria uma submissão em segunda instância para demonstração
  const createSecondInstanceTest = async () => {
    if (!currentUser?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado para criar uma submissão de teste.",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Busca as missões deste anunciante
      const { data: missions, error: missionsError } = await missionService.supabase
        .from('missions')
        .select('id')
        .eq('created_by', currentUser.id)
        .limit(1);
      
      if (missionsError) throw missionsError;
      
      if (!missions || missions.length === 0) {
        toast({
          title: "Sem missões",
          description: "Você precisa criar pelo menos uma campanha antes de testar a moderação.",
          variant: "destructive"
        });
        return;
      }
      
      // Cria uma submissão já em segunda instância
      const missionId = missions[0].id;
      const { data: submission, error: submissionError } = await missionService.supabase
        .from('mission_submissions')
        .insert({
          mission_id: missionId,
          user_id: currentUser.id,
          status: 'second_instance_pending',
          proof_text: 'Esta é uma submissão em segunda instância para demonstração.',
          submission_data: { test_data: true, message: 'Demonstração de segunda instância.' },
          submitted_at: new Date().toISOString(),
          second_instance: true,
          review_stage: 'second_instance',
          feedback: 'Esta submissão foi rejeitada e enviada para segunda instância.'
        })
        .select()
        .single();
      
      if (submissionError) throw submissionError;
      
      toast({
        title: "Submissão em segunda instância criada",
        description: "Uma submissão em segunda instância foi criada para demonstração.",
      });
      
      // Notifica o componente pai para atualizar a lista
      onRefresh();
      
    } catch (error: any) {
      console.error('Erro ao criar submissão em segunda instância:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar a submissão de teste.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  // Cria uma submissão retornada do admin para o anunciante
  const createReturnedToAdvertiser = async () => {
    if (!currentUser?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado para criar uma submissão de teste.",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Busca as missões deste anunciante
      const { data: missions, error: missionsError } = await missionService.supabase
        .from('missions')
        .select('id')
        .eq('created_by', currentUser.id)
        .limit(1);
      
      if (missionsError) throw missionsError;
      
      if (!missions || missions.length === 0) {
        toast({
          title: "Sem missões",
          description: "Você precisa criar pelo menos uma campanha antes de testar a moderação.",
          variant: "destructive"
        });
        return;
      }
      
      // Cria uma submissão retornada do admin para o anunciante
      const missionId = missions[0].id;
      const { data: submission, error: submissionError } = await missionService.supabase
        .from('mission_submissions')
        .insert({
          mission_id: missionId,
          user_id: currentUser.id,
          status: 'returned_to_advertiser',
          proof_text: 'Esta é uma submissão retornada do administrador para o anunciante.',
          submission_data: { test_data: true, message: 'Demonstração de retorno ao anunciante.' },
          submitted_at: new Date().toISOString(),
          second_instance: true,
          review_stage: 'advertiser',
          second_instance_status: 'approved',
          feedback: 'O administrador aprovou esta submissão em segunda instância e retornou para sua revisão final.'
        })
        .select()
        .single();
      
      if (submissionError) throw submissionError;
      
      toast({
        title: "Submissão retornada criada",
        description: "Uma submissão retornada do admin para você foi criada para demonstração.",
      });
      
      // Notifica o componente pai para atualizar a lista
      onRefresh();
      
    } catch (error: any) {
      console.error('Erro ao criar submissão retornada:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar a submissão de teste.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="border-neon-pink/30 shadow-[0_0_15px_rgba(255,82,174,0.1)]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-neon-pink" />
          Ferramentas de Teste da Moderação
        </CardTitle>
        <CardDescription>
          Crie submissões de teste para demonstrar o fluxo de moderação
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="info">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-neon-cyan" />
                <span>Sobre o Fluxo de Moderação</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Alert className="mb-4">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Fluxo de Moderação com Segunda Instância</AlertTitle>
                <AlertDescription className="mt-2">
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Você (anunciante) recebe submissões "pending" para aprovar ou rejeitar</li>
                    <li>Se você aprovar, o usuário recebe os pontos imediatamente</li>
                    <li>Se você rejeitar, a submissão vai para "second_instance_pending" para revisão do administrador</li>
                    <li>O administrador pode rejeitar definitivamente ou aprovar e retornar para você</li>
                    <li>Submissões retornadas aparecem como "returned_to_advertiser" para sua decisão final</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <Button 
            variant="outline" 
            className="border-neon-cyan/30 hover:border-neon-cyan/50"
            onClick={createTestSubmission}
            disabled={isCreating}
          >
            Criar Submissão Pendente
            {isCreating && <div className="ml-2 animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />}
          </Button>
          
          <Button 
            variant="outline" 
            className="border-neon-pink/30 hover:border-neon-pink/50"
            onClick={createSecondInstanceTest}
            disabled={isCreating}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Criar Segunda Instância
            {isCreating && <div className="ml-2 animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />}
          </Button>
          
          <Button 
            variant="outline" 
            className="border-amber-500/30 hover:border-amber-500/50"
            onClick={createReturnedToAdvertiser}
            disabled={isCreating}
          >
            Criar Retornada p/ Anunciante
            {isCreating && <div className="ml-2 animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModerationTest;
