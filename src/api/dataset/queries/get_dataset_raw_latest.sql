SELECT DISTINCT ON (uuid)
  raw
FROM public.dataset
WHERE uuid = $1::text
ORDER BY uuid, version DESC
LIMIT 1
