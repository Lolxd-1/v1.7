/*
  # Complete Database Schema Update

  1. Core Tables
    - users (id, username, password)
    - sessions (id, user_id, expires_at)
    - chat_messages (id, session_id, profile, role, content)
    - business_reports (id, session_id, report)
    - responses (id, session_id, section_id, question_id, answer)
    - goals (id, session_id, text, completed)
    - user_data (id, user_id, chat_history, responses, business_reports)

  2. Security
    - Enable RLS on all tables
    - Add policies for data access
    - Create necessary indexes

  3. Functions & Triggers
    - Updated at handlers
    - Anonymous session creation
    - Response validation
    - User data management
*/

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.goals CASCADE;
DROP TABLE IF EXISTS public.responses CASCADE;
DROP TABLE IF EXISTS public.business_reports CASCADE;
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.user_data CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Core Tables
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);

CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
    profile TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.business_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
    report JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
    section_id TEXT NOT NULL,
    question_id TEXT NOT NULL,
    answer JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(session_id, section_id, question_id)
);

CREATE TABLE public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.user_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    chat_history JSONB DEFAULT '[]'::jsonb,
    responses JSONB DEFAULT '[]'::jsonb,
    business_reports JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Functions
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_anonymous_session()
RETURNS UUID AS $$
DECLARE
    anonymous_user_id UUID;
    new_session_id UUID;
BEGIN
    SELECT id INTO anonymous_user_id
    FROM public.users
    WHERE username = 'anonymous';

    INSERT INTO public.sessions (user_id)
    VALUES (anonymous_user_id)
    RETURNING id INTO new_session_id;

    RETURN new_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION check_response_user_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.user_id != auth.uid() THEN
        RAISE EXCEPTION 'Cannot modify responses for other users';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_responses(p_user_id UUID)
RETURNS TABLE (
    section_id TEXT,
    question_id TEXT,
    answer JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.section_id,
        r.question_id,
        r.answer,
        r.created_at,
        r.updated_at
    FROM public.responses r
    INNER JOIN public.sessions s ON r.session_id = s.id
    WHERE s.user_id = p_user_id
    ORDER BY r.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_business_reports_updated_at
    BEFORE UPDATE ON public.business_reports
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_responses_updated_at
    BEFORE UPDATE ON public.responses
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_goals_updated_at
    BEFORE UPDATE ON public.goals
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_user_data_updated_at
    BEFORE UPDATE ON public.user_data
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_user_created
    AFTER INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_data();

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for all users"
    ON public.users FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for signup"
    ON public.users FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update own record"
    ON public.users FOR UPDATE
    USING (id = auth.uid());

CREATE POLICY "Enable session management"
    ON public.sessions FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Enable chat messages access"
    ON public.chat_messages FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.sessions
        WHERE sessions.id = chat_messages.session_id
        AND sessions.user_id = auth.uid()
    ));

CREATE POLICY "Enable business reports access"
    ON public.business_reports FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.sessions
        WHERE sessions.id = business_reports.session_id
        AND sessions.user_id = auth.uid()
    ));

CREATE POLICY "Users can manage own responses"
    ON public.responses FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.sessions
        WHERE sessions.id = responses.session_id
        AND sessions.user_id = auth.uid()
    ));

CREATE POLICY "Enable goals access"
    ON public.goals FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.sessions
        WHERE sessions.id = goals.session_id
        AND sessions.user_id = auth.uid()
    ));

CREATE POLICY "Users can access own data"
    ON public.user_data FOR ALL
    USING (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON public.sessions(expires_at);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_profile ON public.chat_messages(profile);
CREATE INDEX idx_business_reports_session_id ON public.business_reports(session_id);
CREATE INDEX idx_responses_session_id ON public.responses(session_id);
CREATE INDEX idx_goals_session_id ON public.goals(session_id);
CREATE INDEX idx_user_data_user_id ON public.user_data(user_id);