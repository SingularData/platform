SELECT
  ds.uuid,
  ds.name,
  ds.description,
  ds.publisher,
  ds.portal,
  ds.portal_url,
  ds.platform,
  ds.url,
  ds.created,
  ds.updated,
  ds.license,
  ds.version,
  ds.version_history,
  ds.files,
  ds.tags,
  ds.categories,
  ds.region
FROM public.mview_latest_dataset AS ds
WHERE uuid = $1::text
LIMIT 1;
