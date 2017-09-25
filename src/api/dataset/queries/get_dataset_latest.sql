SELECT
  ds.identifier,
  ds.title,
  ds.description,
  ds.publisher,
  ds.portal,
  ds.portal_url,
  ds.platform,
  ds.landing_page,
  ds.issued,
  ds.modified,
  ds.license,
  ds.version,
  ds.version_history,
  ds.distribution,
  ds.keyword,
  ds.theme,
  ds.spatial
FROM public.mview_latest_dataset AS ds
WHERE identifier = $1::text
LIMIT 1;
