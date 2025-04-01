/*
  # Update Schema to Use Direct User References
  
  1. Schema Changes
    - Modify chat_messages to use user_id instead of session_id
    - Modify business_reports to use user_id instead of session_id
    - Modify responses to use user_id instead of session_id
    - Update indexes and constraints
  
  2. Data Migration
    - Migrate existing data to use user_id from sessions
    - Remove orphaned records
  
  3. Security Updates
    - Update RLS policies to use direct user_id checks
*/

-- Migrate chat_messages to use user_id
ALTER TABLE public.chat_messages 
ADD COLUMN user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;

UPDATE public.chat_messages cm
SET user_id = s.user_id
FROM public.sessions s
WHERE cm.session_id = s.id;

ALTER TABLE public.chat_messages
ALTER COLUMN user_id SET NOT NULL;

-- Migrate business_reports to use user_id
ALTER TABLE public.business_reports 
ADD COLUMN user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;

UPDATE public.business_reports br
SET user_id = s.user_id
FROM public.sessions s
WHERE br.session_id = s.id;

ALTER TABLE public.business_reports
ALTER COLUMN user_id SET NOT NULL;

-- Migrate responses to use user_id
ALTER TABLE public.responses 
ADD COLUMN user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;

UPDATE public.responses r
SET user_id = s.user_id
FROM public.sessions s
WHERE r.session_id = s.id;

ALTER TABLE public.responses
ALTER COLUMN user_id SET NOT NULL;

-- Drop old foreign keys and columns
ALTER TABLE public.chat_messages DROP COLUMN session_id;
ALTER TABLE public.business_reports DROP COLUMN session_id;
ALTER TABLE public.responses DROP COLUMN session_id;

-- Update indexes
DROP INDEX IF EXISTS idx_chat_messages_session_id;
DROP INDEX IF EXISTS idx_business_reports_session_id;
DROP INDEX IF EXISTS idx_responses_session_id;

CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX idx_business_reports_user_id ON public.business_reports(user_id);
CREATE INDEX idx_responses_user_id ON public.responses(user_id);

-- Update unique constraint for responses
ALTER TABLE public.responses
DROP CONSTRAINT IF EXISTS responses_session_id_section_id_question_id_key;

ALTER TABLE public.responses
ADD CONSTRAINT responses_user_id_section_id_question_id_unique 
UNIQUE (user_id, section_id, question_id);

-- Update RLS policies
DROP POLICY IF EXISTS "Enable chat messages access" ON public.chat_messages;
CREATE POLICY "Enable chat messages access"
    ON public.chat_messages FOR ALL
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Enable business reports access" ON public.business_reports;
CREATE POLICY "Enable business reports access"
    ON public.business_reports FOR ALL
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage own responses" ON public.responses;
CREATE POLICY "Users can manage own responses"
    ON public.responses FOR ALL
    USING (user_id = auth.uid());

-- Update goals table to use user_id
ALTER TABLE public.goals 
ADD COLUMN user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;

UPDATE public.goals g
SET user_id = s.user_id
FROM public.sessions s
WHERE g.session_id = s.id;

ALTER TABLE public.goals
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.goals DROP COLUMN session_id;

DROP INDEX IF EXISTS idx_goals_session_id;
CREATE INDEX idx_goals_user_id ON public.goals(user_id);

DROP POLICY IF EXISTS "Enable goals access" ON public.goals;
CREATE POLICY "Enable goals access"
    ON public.goals FOR ALL
    USING (user_id = auth.uid());