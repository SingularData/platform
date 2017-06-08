SELECT DISTINCT ON (uuid)
  raw
FROM public.dataset
WHERE uuid = $1::integer
ORDER BY uuid
LIMIT 1
