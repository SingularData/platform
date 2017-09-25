WITH ds as (
  SELECT
    d.id,
    d.identifier,
    d.title,
    d.description,
    p.name AS publisher,
    po.name AS portal,
    po.url AS portal_url,
    pl.name AS platform,
    d.landing_page,
    d.issued,
    d.modified,
    d.license,
    ST_AsGeoJSON(dc.geom, 6)::json AS spatial,
    version AS version
  FROM dataset AS d
  LEFT JOIN dataset_publisher_xref AS dpx ON dpx.dataset_id = d.id
  LEFT JOIN dataset_publisher p ON p.id = dpx.dataset_publisher_id
  LEFT JOIN dataset_portal_xref AS dpox ON dpox.dataset_id = d.id
  LEFT JOIN portal AS po ON po.id = dpox.portal_id
  LEFT JOIN platform AS pl ON pl.id = po.platform_id
  LEFT JOIN dataset_coverage_xref AS dcx ON dcx.dataset_id = d.id
  LEFT JOIN dataset_coverage AS dc ON dc.id = dcx.dataset_coverage_id
  WHERE d.identifier = $1::text
  LIMIT 1
), dt AS (
  SELECT
    dtx.dataset_id,
    array_agg(dt.name) AS theme
  FROM ds, dataset_theme_xref AS dtx
  LEFT JOIN dataset_theme AS dt ON dt.id = dtx.dataset_theme_id
  WHERE dtx.dataset_id = ds.id
  GROUP BY dtx.dataset_id
), dk AS (
  SELECT
    dkx.dataset_id,
    array_agg(dk.name)AS keyword
  FROM ds, dataset_keyword_xref AS dkx
  LEFT JOIN dataset_keyword AS dk ON dk.id = dkx.dataset_keyword_id
  WHERE dkx.dataset_id = ds.id
  GROUP BY dkx.dataset_id
), dd AS (
  SELECT
    dataset_id,
    array_agg(json_build_object(
      'title', dd.title,
      'format', dd.format,
      'accessURL', dd.access_url,
      'downloadURL', dd.download_url,
      'description', dd.description
    )) AS distribution
  FROM ds, dataset_distribution AS dd
  WHERE dd.dataset_id = ds.id
  GROUP BY dd.dataset_id
)
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
  ds.spatial,
  ds.version,
  mld.version_history,
  COALESCE(dd.distribution, '{}') AS distribution,
  COALESCE(dk.keyword, '{}') AS keyword,
  COALESCE(dt.theme, '{}') AS theme
FROM ds
LEFT JOIN dd ON dd.dataset_id = ds.id
LEFT JOIN dk ON dk.dataset_id = ds.id
LEFT JOIN dt ON dt.dataset_id = ds.id
LEFT JOIN mview_latest_dataset AS mld ON
  mld.title = ds.title AND mld.portal = ds.portal;
