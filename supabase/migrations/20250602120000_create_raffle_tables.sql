-- Criação de tabelas de rifas e tickets + RLS
-- Data: 2025-06-02

-- Tabela principal de rifas
CREATE TABLE IF NOT EXISTS raffles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    total_tickets INTEGER NOT NULL,
    price_per_ticket NUMERIC(10,2) NOT NULL DEFAULT 0,
    tickets_sold INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'open', -- open | closed | finished
    draw_date TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela que registra compra de tickets por usuário
CREATE TABLE IF NOT EXISTS raffle_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raffle_id UUID NOT NULL REFERENCES raffles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    qty INTEGER NOT NULL,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_raffle_tickets_user ON raffle_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_raffle_tickets_raffle ON raffle_tickets(raffle_id);

-- Trigger para diminuir total_tickets e aumentar sold quando comprar
CREATE OR REPLACE FUNCTION handle_raffle_ticket_purchase()
RETURNS TRIGGER AS $$
BEGIN
    -- valida se existem tickets suficientes
    PERFORM 1 FROM raffles r WHERE r.id = NEW.raffle_id AND (r.total_tickets - r.tickets_sold) >= NEW.qty AND r.status = 'open';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Tickets insuficientes ou rifa encerrada';
    END IF;

    -- atualiza contagem
    UPDATE raffles
    SET tickets_sold = tickets_sold + NEW.qty,
        updated_at = now()
    WHERE id = NEW.raffle_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_raffle_ticket_purchase
BEFORE INSERT ON raffle_tickets
FOR EACH ROW
EXECUTE FUNCTION handle_raffle_ticket_purchase();

-- RLS -------------------------------------------------------------------
ALTER TABLE raffles ENABLE ROW LEVEL SECURITY;
ALTER TABLE raffle_tickets ENABLE ROW LEVEL SECURITY;

-- Criador pode gerenciar sua rifa; qualquer autenticado pode ver abertas
DROP POLICY IF EXISTS raffles_default ON raffles;
CREATE POLICY raffles_default ON raffles
    FOR SELECT USING (status = 'open' OR created_by = auth.uid());
CREATE POLICY raffles_owner_modify ON raffles
    FOR ALL USING (created_by = auth.uid());

-- Tickets: usuários veem os próprios, admins veem todos
DROP POLICY IF EXISTS raffle_tickets_default ON raffle_tickets;
CREATE POLICY raffle_tickets_default ON raffle_tickets
    FOR ALL USING (user_id = auth.uid() OR EXISTS(SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.user_type IN ('admin','moderator')));

-- Função que sorteia vencedor(es) e registra resultado
CREATE OR REPLACE FUNCTION distribute_raffle_prizes(p_raffle_id UUID)
RETURNS TABLE(user_id UUID, ticket_id UUID) AS $$
DECLARE
    v_total_tickets INTEGER;
    v_random_offset INTEGER;
BEGIN
    -- Fechar rifa para compras
    UPDATE raffles
    SET status = 'finished', updated_at = now()
    WHERE id = p_raffle_id AND status = 'open';

    -- Sorteio simples: um vencedor (pode ser expandido)
    SELECT count(*) INTO v_total_tickets FROM raffle_tickets WHERE raffle_id = p_raffle_id;
    IF v_total_tickets = 0 THEN
        RAISE EXCEPTION 'Nenhum ticket vendido';
    END IF;

    v_random_offset := floor(random() * v_total_tickets);

    RETURN QUERY
    SELECT rt.user_id, rt.id
    FROM raffle_tickets rt
    WHERE rt.raffle_id = p_raffle_id
    OFFSET v_random_offset LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 