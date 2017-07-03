SELECT raw FROM public.dataset
WHERE uuid = $1::text AND version = $2::integer
LIMIT 1
