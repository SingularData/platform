SELECT
  ds.version_history,
FROM public.mview_latest_dataset AS ds
WHERE title = $2::text AND portal = $1:: text
LIMIT 1;
