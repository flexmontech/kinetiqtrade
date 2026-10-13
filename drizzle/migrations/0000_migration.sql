CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  business_name text NOT NULL,
  owner_name text,
  trade text NOT NULL,
  city text NOT NULL,
  phone text,
  email text,
  rating numeric(2,1) NOT NULL DEFAULT 0,
  review_count integer NOT NULL DEFAULT 0,
  stage text NOT NULL DEFAULT 'Discovered',
  view_count integer NOT NULL DEFAULT 0,
  last_viewed_at timestamptz,
  reviews jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "phase1 open read" ON public.leads FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "phase1 open insert" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "phase1 open update" ON public.leads FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "phase1 open delete" ON public.leads FOR DELETE TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.record_lead_view(_slug text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.leads SET view_count = view_count + 1, last_viewed_at = now(),
    stage = CASE WHEN stage IN ('Pitched','Demo Ready') THEN 'Viewed' ELSE stage END
  WHERE slug = _slug;
$$;
GRANT EXECUTE ON FUNCTION public.record_lead_view(text) TO anon, authenticated;

INSERT INTO public.leads (slug,business_name,owner_name,trade,city,phone,rating,review_count,stage,view_count,last_viewed_at,reviews) VALUES
('fox-valley-comfort-hvac','Fox Valley Comfort HVAC','Mike Kowalski','HVAC','Aurora','(630) 555-0142',4.8,63,'Discovered',0,NULL,'[{"author":"Jenna R.","text":"Furnace died on a Sunday night in January. Mike was here within two hours and had us warm by midnight.","rating":5},{"author":"Tom B.","text":"Honest pricing, no upsell. Replaced our AC coil for less than two other quotes.","rating":5},{"author":"Priya S.","text":"Clean, on time, explained everything. Our go-to now.","rating":5}]'),
('prairie-state-roofing','Prairie State Roofing','Dave Lindgren','Roofing','Naperville','(630) 555-0199',4.7,41,'Demo Ready',0,NULL,'[{"author":"Carol M.","text":"After the hail storm they handled the insurance claim start to finish. New roof in two days.","rating":5},{"author":"Steve P.","text":"Crew cleaned up every nail. Neighbors asked for their number.","rating":5}]'),
('will-county-plumbing-pros','Will County Plumbing Pros','Ray Gutierrez','Plumbing','Joliet','(815) 555-0117',4.9,88,'Pitched',2,now() - interval '3 minutes','[{"author":"Angela T.","text":"Burst pipe at 6am. Ray picked up on the first ring and fixed it before work.","rating":5},{"author":"Mark D.","text":"Water heater swapped same day. Fair and fast.","rating":5}]'),
('bolingbrook-tree-care','Bolingbrook Tree Care','Luis Ortega','Tree Service','Bolingbrook','(630) 555-0175',4.6,27,'Viewed',5,now() - interval '2 days','[{"author":"Dana W.","text":"Took down a huge dead oak hanging over our garage with zero damage.","rating":5},{"author":"Kevin L.","text":"Stump grinding was quick and they hauled everything away.","rating":4}]'),
('wheaton-green-landscaping','Wheaton Green Landscaping','Sarah Becker','Landscaping','Wheaton','(630) 555-0133',4.8,52,'Won',9,now() - interval '6 days','[{"author":"Jim K.","text":"Our backyard went from mud pit to paver patio and gardens. Stunning work.","rating":5},{"author":"Lisa H.","text":"Weekly mowing is always on schedule and edged perfectly.","rating":5}]'),
('aurora-pro-painters','Aurora Pro Painters','Tony Russo','Painting','Aurora','(630) 555-0188',4.4,12,'Discovered',0,NULL,'[{"author":"Megan F.","text":"Cabinets look factory new. Very tidy crew.","rating":5}]'),
('naperville-air-masters','Naperville Air Masters','Greg Holt','HVAC','Naperville','(630) 555-0121',4.5,19,'Discovered',0,NULL,'[{"author":"Ben C.","text":"Tune-up was thorough and they found a cracked heat exchanger before winter.","rating":5}]'),
('joliet-roof-rescue','Joliet Roof Rescue','Brian Walsh','Roofing','Joliet','(815) 555-0163',4.2,9,'Discovered',0,NULL,'[{"author":"Rita G.","text":"Patched a leak quickly after a storm.","rating":4}]'),
('dupage-drain-and-sewer','DuPage Drain & Sewer','Chris Novak','Plumbing','Wheaton','(630) 555-0109',4.7,34,'Demo Ready',0,NULL,'[{"author":"Paul E.","text":"Camera inspection showed exactly the root problem. Fixed in an afternoon.","rating":5}]'),
('bolingbrook-lawn-and-stone','Bolingbrook Lawn & Stone','Maria Lopez','Landscaping','Bolingbrook','(630) 555-0156',4.9,71,'Pitched',1,now() - interval '20 hours','[{"author":"Nick A.","text":"Retaining wall is rock solid and looks amazing.","rating":5}]'),
('oak-and-ash-tree-service','Oak & Ash Tree Service','Jake Peterson','Tree Service','Naperville','(630) 555-0144',4.3,14,'Discovered',0,NULL,'[{"author":"Holly V.","text":"Emergency storm cleanup the same morning.","rating":5}]'),
('joliet-fresh-coat','Joliet Fresh Coat Painting','Ed Murphy','Painting','Joliet','(815) 555-0190',4.6,22,'Demo Ready',0,NULL,'[{"author":"Sandra O.","text":"Exterior repaint finished ahead of schedule and the color matching was perfect.","rating":5}]');