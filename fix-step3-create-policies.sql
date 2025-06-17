-- Passo 3: Criar políticas RLS para tabelas existentes
-- Execute este script após habilitar RLS nas tabelas

-- Políticas para profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
  
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
  
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para missions
DROP POLICY IF EXISTS "Users can view missions" ON public.missions;
CREATE POLICY "Users can view missions" ON public.missions
  FOR SELECT USING (status = 'ativa' OR created_by = auth.uid());
  
DROP POLICY IF EXISTS "Creators can manage missions" ON public.missions;
CREATE POLICY "Creators can manage missions" ON public.missions
  FOR ALL USING (created_by = auth.uid());

-- Políticas para mission_submissions
DROP POLICY IF EXISTS "Users can view own submissions" ON public.mission_submissions;
CREATE POLICY "Users can view own submissions" ON public.mission_submissions
  FOR SELECT USING (user_id = auth.uid());
  
DROP POLICY IF EXISTS "Users can create submissions" ON public.mission_submissions;
CREATE POLICY "Users can create submissions" ON public.mission_submissions
  FOR INSERT WITH CHECK (user_id = auth.uid());
  
DROP POLICY IF EXISTS "Mission creators can view submissions" ON public.mission_submissions;
CREATE POLICY "Mission creators can view submissions" ON public.mission_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.missions m
      WHERE m.id = mission_id AND m.created_by = auth.uid()
    )
  );

-- Verificar políticas criadas
SELECT tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname; 