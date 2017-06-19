SELECT
  ds.uuid,
  ds.name,
  ds.description,
  ds.publisher,
  ds.portal,
  ds.portal_url,
  ds.platform,
  ds.portal_link,
  ds.created_time,
  ds.updated_time,
  ds.license,
  ds.version_number AS version,
  ds.version_history,
  ds.data,
  ds.tags,
  ds.categories,
  CASE WHEN ds.region IS NULL THEN NULL
  ELSE
    json_build_object(
      'type', 'Feature',
      'geometry', ST_AsGeoJSON(ds.region, 6)::json,
      'properties', json_build_object('name', ds.region_name)
    )
  END AS region
FROM public.mview_latest_dataset AS ds
WHERE uuid = $1::text
LIMIT 1;
