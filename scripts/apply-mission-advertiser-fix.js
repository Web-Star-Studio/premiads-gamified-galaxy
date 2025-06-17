#!/usr/bin/env node

/**
 * Script para aplicar a correção do campo advertiser_id nas missões
 * 
 * Este script executa a migração SQL que garante que todas as missões
 * tenham um advertiser_id válido, associando-as ao usuário que as criou.
 * 
 * Uso: node scripts/apply-mission-advertiser-fix.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obter o diretório atual do módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração do Supabase - valores fixos do projeto
// Esses valores são públicos e já estão no código em src/services/supabase.ts
const SUPABASE_URL = "https://zfryjwaeojccskfiibtq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmcnlqd2Flb2pjY3NrZmlpYnRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNzA1MDAsImV4cCI6MjA2MDg0NjUwMH0.tgN7P0_QIgNu1ezptyJIKtYGRyOJSxV_skDn0WrVlN8";

// Criar cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Caminho para o arquivo de migração
const migrationFilePath = path.join(__dirname, '..', 'supabase', 'migrations', '20240601000000_fix_mission_advertiser_id.sql');

async function applyMigration() {
  try {
    console.log('Lendo arquivo de migração...');
    const migrationSql = fs.readFileSync(migrationFilePath, 'utf8');
    
    console.log('Aplicando migração...');
    
    // Verificar se há missões sem advertiser_id antes da migração
    const { data: missionsBeforeFix, error: beforeError } = await supabase
      .from('missions')
      .select('id, title')
      .is('advertiser_id', null);
    
    if (beforeError) {
      console.error('Erro ao verificar missões antes da correção:', beforeError);
    } else {
      console.log(`Encontradas ${missionsBeforeFix?.length || 0} missões sem advertiser_id antes da correção`);
    }
    
    // Executar a migração SQL
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSql });
    
    if (error) {
      console.error('Erro ao aplicar migração:', error);
      
      // Tentar executar partes individuais da migração
      console.log('Tentando aplicar a migração em partes...');
      
      // Atualizar missões sem advertiser_id
      const { error: updateError } = await supabase.rpc('exec_sql', { 
        sql: 'UPDATE missions SET advertiser_id = created_by WHERE advertiser_id IS NULL AND created_by IS NOT NULL;' 
      });
      
      if (updateError) {
        console.error('Erro ao atualizar missões:', updateError);
      } else {
        console.log('Missões atualizadas com sucesso');
      }
      
      // Criar índice
      const { error: indexError } = await supabase.rpc('exec_sql', { 
        sql: 'CREATE INDEX IF NOT EXISTS idx_missions_advertiser_id ON missions(advertiser_id);' 
      });
      
      if (indexError) {
        console.error('Erro ao criar índice:', indexError);
      } else {
        console.log('Índice criado com sucesso');
      }
    } else {
      console.log('Migração aplicada com sucesso!');
    }
    
    // Verificar se há missões sem advertiser_id após a migração
    const { data: missionsAfterFix, error: afterError } = await supabase
      .from('missions')
      .select('id, title')
      .is('advertiser_id', null);
    
    if (afterError) {
      console.error('Erro ao verificar missões após a correção:', afterError);
    } else {
      console.log(`Encontradas ${missionsAfterFix?.length || 0} missões sem advertiser_id após a correção`);
      
      if (missionsAfterFix && missionsAfterFix.length > 0) {
        console.log('Missões que ainda precisam de correção:');
        console.log(missionsAfterFix);
      }
    }
    
  } catch (error) {
    console.error('Erro inesperado:', error);
    process.exit(1);
  }
}

// Executar a função principal
applyMigration()
  .then(() => {
    console.log('Processo concluído');
  })
  .catch(err => {
    console.error('Erro fatal:', err);
    process.exit(1);
  }); 