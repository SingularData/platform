SELECT
  raw
FROM public.dataset
WHERE identifier = $1::text
LIMIT 1
