
-- Create memory_tags junction table
CREATE TABLE public.memory_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  memory_id uuid NOT NULL REFERENCES public.memories(id) ON DELETE CASCADE,
  tagged_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (memory_id, tagged_user_id)
);

-- Enable RLS
ALTER TABLE public.memory_tags ENABLE ROW LEVEL SECURITY;

-- Users can insert tags on their own memories
CREATE POLICY "Users can tag on own memories"
ON public.memory_tags FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.memories WHERE id = memory_id AND user_id = auth.uid())
);

-- Users can view tags on their own memories OR where they are tagged
CREATE POLICY "Users can view relevant tags"
ON public.memory_tags FOR SELECT TO authenticated
USING (
  tagged_user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.memories WHERE id = memory_id AND user_id = auth.uid())
);

-- Users can delete tags from their own memories
CREATE POLICY "Users can delete tags on own memories"
ON public.memory_tags FOR DELETE TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.memories WHERE id = memory_id AND user_id = auth.uid())
);

-- Allow users to view all profiles (for searching people to tag)
CREATE POLICY "Users can view all profiles for tagging"
ON public.profiles FOR SELECT TO authenticated
USING (true);

-- Drop the restrictive profile select policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
