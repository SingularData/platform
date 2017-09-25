WITH ds AS (
  SELECT
    dpx.portal_id,
    d.id
  FROM dataset AS d
  LEFT JOIN dataset_portal_xref AS dpx ON dpx.dataset_id = d.id
  WHERE version_period @> $1::timestamptz
), dk AS (
  SELECT
    portal_id,
    array_agg(json_build_object(
      'name', keyword,
      'datasetCount', count
    )) AS keywords
  FROM (
    SELECT
      portal_id,
      dk.name AS keyword,
      COUNT(dataset_id)
    FROM dataset_keyword_xref AS dkx
    INNER JOIN ds ON dkx.dataset_id = ds.id
    LEFT JOIN dataset_keyword AS dk ON dk.id = dkx.dataset_keyword_id
    GROUP BY portal_id, dk.name
  ) AS keyword_stats
  GROUP BY portal_id
), dt AS (
  SELECT
    portal_id,
    array_agg(json_build_object(
      'name', theme,
      'datasetCount', count
    )) AS themes
  FROM (
    SELECT
      portal_id,
      dt.name AS theme,
      COUNT(dataset_id)
    FROM dataset_theme_xref AS dtx
    INNER JOIN ds ON ds.id = dtx.dataset_id
    LEFT JOIN dataset_theme AS dt ON dt.id = dtx.dataset_theme_id
    GROUP BY portal_id, dt.name
  ) AS theme_stats
  GROUP BY portal_id
), dp AS (
  SELECT
    portal_id,
    array_agg(json_build_object(
      'name', publisher,
      'datasetCount', count
    )) AS publishers
  FROM (
    SELECT
      portal_id,
      p.name AS publisher,
      COUNT(ds.id)
    FROM dataset_publisher_xref AS dpx
    INNER JOIN ds ON ds.id = dpx.dataset_id
    LEFT JOIN dataset_publisher AS p ON p.id = dpx.dataset_publisher_id
    GROUP BY portal_id, p.name
  ) AS publisher_stats
  GROUP BY portal_id
)
SELECT
  p.name,
  p.url,
  p.description,
  pl.name AS platform,
  l.name AS location,
  dt.themes,
  dk.keywords,
  dp.publishers,
  ds_stats.count AS dataset_count
FROM portal AS p
LEFT JOIN public.location AS l ON l.id = p.location_id
LEFT JOIN platform AS pl ON pl.id = p.platform_id
LEFT JOIN dt ON dt.portal_id = p.id
LEFT JOIN dk ON dk.portal_id = p.id
LEFT JOIN dp ON dp.portal_id = p.id
LEFT JOIN (
  SELECT
    portal_id,
    COUNT(id)
  FROM ds
  GROUP BY portal_id
) AS ds_stats ON ds_stats.portal_id = p.id
