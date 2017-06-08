SELECT raw FROM public.dataset
WHERE uuid = $1::integer AND version_number = $2::integer
LIMIT 1
