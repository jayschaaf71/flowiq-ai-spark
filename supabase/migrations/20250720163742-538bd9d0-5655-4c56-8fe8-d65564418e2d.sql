-- Create chat conversations table
CREATE TABLE public.chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  staff_id UUID NULL,
  title TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  last_message_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tenant_id UUID NULL
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('patient', 'staff')),
  message_text TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'image', 'file')),
  attachment_url TEXT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tenant_id UUID NULL
);

-- Enable RLS on both tables
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for chat_conversations
CREATE POLICY "Patients can view their own conversations"
ON public.chat_conversations
FOR SELECT
USING (auth.uid() = patient_id);

CREATE POLICY "Staff can view all conversations"
ON public.chat_conversations
FOR ALL
USING (has_staff_access(auth.uid()));

CREATE POLICY "Patients can create conversations"
ON public.chat_conversations
FOR INSERT
WITH CHECK (auth.uid() = patient_id);

-- RLS policies for chat_messages
CREATE POLICY "Users can view messages in their conversations"
ON public.chat_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_conversations cc
    WHERE cc.id = conversation_id
    AND (cc.patient_id = auth.uid() OR has_staff_access(auth.uid()))
  )
);

CREATE POLICY "Users can create messages in their conversations"
ON public.chat_messages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_conversations cc
    WHERE cc.id = conversation_id
    AND (cc.patient_id = auth.uid() OR has_staff_access(auth.uid()))
  )
);

CREATE POLICY "Staff can manage all messages"
ON public.chat_messages
FOR ALL
USING (has_staff_access(auth.uid()));

-- Add triggers for updated_at
CREATE TRIGGER update_chat_conversations_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key relationships
ALTER TABLE public.chat_conversations
ADD CONSTRAINT fk_chat_conversations_patient
FOREIGN KEY (patient_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.chat_conversations
ADD CONSTRAINT fk_chat_conversations_staff
FOREIGN KEY (staff_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.chat_messages
ADD CONSTRAINT fk_chat_messages_conversation
FOREIGN KEY (conversation_id) REFERENCES public.chat_conversations(id) ON DELETE CASCADE;

ALTER TABLE public.chat_messages
ADD CONSTRAINT fk_chat_messages_sender
FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;