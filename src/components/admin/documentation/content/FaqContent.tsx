
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FaqContent: React.FC = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Perguntas Frequentes (FAQ) Técnico</h3>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1" className="border-b border-zinc-800">
            <AccordionTrigger className="text-left py-4 hover:no-underline">
              Como posso alterar as configurações de permissões de usuários?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-zinc-400">
                      As permissões de usuários são gerenciadas diretamente através do sistema de usuários.
        Navegue até Admin &gt; Usuários, selecione o usuário que deseja modificar,
        e utilize as configurações de permissões para ajustar os níveis de acesso.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="q2" className="border-b border-zinc-800">
            <AccordionTrigger className="text-left py-4 hover:no-underline">
              Como funciona o algoritmo de sorteio?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-zinc-400">
              O sistema utiliza um gerador de números pseudoaleatórios (PRNG) criptograficamente seguro,
              baseado no algoritmo ChaCha20, para selecionar os ganhadores de sorteios.
              Todo o processo é auditado e registrado para garantir transparência e imparcialidade.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="q3" className="border-b border-zinc-800">
            <AccordionTrigger className="text-left py-4 hover:no-underline">
              É possível customizar os relatórios gerados pelo sistema?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-zinc-400">
              Sim, todos os relatórios podem ser personalizados através do módulo de Relatórios.
              Você pode selecionar quais campos serão exibidos, aplicar filtros específicos,
              e definir agregações para análises mais detalhadas.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="q4" className="border-b border-zinc-800">
            <AccordionTrigger className="text-left py-4 hover:no-underline">
              Como implementar uma nova regra de negócio no sistema?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-zinc-400">
              Novas regras de negócio podem ser configuradas através do módulo de Regras.
              Acesse Admin &gt; Regras, clique em "Nova Regra", defina as condições e ações
              utilizando o editor visual ou o formato JSON. Teste a regra em ambiente de homologação
              antes de publicá-la no ambiente de produção.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="q5" className="border-b border-zinc-800">
            <AccordionTrigger className="text-left py-4 hover:no-underline">
              O que fazer em caso de falha no sistema?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-zinc-400">
              Em caso de falha, acesse o módulo de Monitoramento para identificar a origem do problema.
              Verifique os logs de erro detalhados e utilize a funcionalidade de rollback se necessário.
              Para falhas críticas, entre em contato com o suporte técnico através do canal prioritário.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );

export default FaqContent;
