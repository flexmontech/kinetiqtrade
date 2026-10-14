CREATE OR REPLACE FUNCTION public.record_lead_view(_slug text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.leads SET view_count = view_count + 1, last_viewed_at = now(),
    stage = CASE WHEN stage IN ('Pitched','Active Ready','Demo Ready') THEN 'Viewed' ELSE stage END
  WHERE slug = _slug;
$$;
GRANT EXECUTE ON FUNCTION public.record_lead_view(text) TO anon, authenticated;