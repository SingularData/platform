WITH ds as (
  SELECT
    d.id,
    d.uuid,
    d.portal_dataset_id,
    d.name,
    d.description,
    p.name AS publisher,
    po.name AS portal,
    po.url AS portal_url,
    pl.name AS platform,
    d.portal_link,
    d.created_time,
    d.updated_time,
    d.license,
    CASE WHEN d.dataset_region_id IS NOT NULL THEN
      json_build_object(
        'type', 'Feature',
        'geometry', ST_AsGeoJSON(dr.geom, 6)::json,
        'properties', json_build_object('name', dr.name)
      )
    ELSE NULL END AS region,
    version_number AS version
  FROM dataset AS d
  LEFT JOIN dataset_publisher p ON p.id = d.publisher_id
  LEFT JOIN portal AS po ON po.id = d.portal_id
  LEFT JOIN platform AS pl ON pl.id = po.platform_id
  LEFT JOIN dataset_region AS dr ON dr.id = d.dataset_region_id
  WHERE d.uuid = $1::text AND d.version_number = $2::integer
  LIMIT 1
), versions AS (
  SELECT
    uuid,
    array_agg(json_build_object(
      'version', version_number,
      'updatedTime', lower(version_period)
    ) ORDER BY version_number DESC) AS all
  FROM dataset
  WHERE uuid = $1::text
  GROUP BY uuid
), dc AS (
  SELECT
    dcx.dataset_id,
    array_agg(dc.name) AS categories
  FROM ds, dataset_category_xref AS dcx
  LEFT JOIN dataset_category AS dc ON dc.id = dcx.dataset_category_id
  WHERE dcx.dataset_id = ds.id
  GROUP BY dcx.dataset_id
), dt AS (
  SELECT
    dtx.dataset_id,
    array_agg(dt.name)AS tags
  FROM ds, dataset_tag_xref AS dtx
  LEFT JOIN dataset_tag AS dt ON dt.id = dtx.dataset_tag_id
  WHERE dtx.dataset_id = ds.id
  GROUP BY dtx.dataset_id
), dd AS (
  SELECT
    dataset_id,
    array_agg(json_build_object(
      'name', dd.name,
      'format', dd.format,
      'link', dd.link,
      'description', dd.description
    )) AS data
  FROM ds, dataset_data AS dd
  WHERE dd.dataset_id = ds.id
  GROUP BY dd.dataset_id
)
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
  ds.region,
  ds.version,
  COALESCE(v.all, '{}') AS version_history,
  COALESCE(dd.data, '{}') AS data,
  COALESCE(dt.tags, '{}') AS tags,
  COALESCE(dc.categories, '{}') AS categories
FROM ds
LEFT JOIN dt ON dt.dataset_id = ds.id
LEFT JOIN dc ON dc.dataset_id = ds.id
LEFT JOIN dd ON dd.dataset_id = ds.id
LEFT JOIN versions AS v ON v.uuid = ds.uuid
