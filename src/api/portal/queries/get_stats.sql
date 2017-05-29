WITH ds AS (
  SELECT
    portal_id,
    id,
    publisher_id
  FROM dataset
  WHERE version_period @> $1::timestamptz
), dt AS (
  SELECT
    portal_id,
    array_agg(json_build_object(
      'name', tag,
      'datasetCount', count
    )) AS tags
  FROM (
    SELECT
      portal_id,
      dt.name AS tag,
      COUNT(dataset_id)
    FROM dataset_tag_xref AS dtx
    INNER JOIN ds ON dataset_id = ds.id
    LEFT JOIN dataset_tag AS dt ON dt.id = dtx.dataset_tag_id
    GROUP BY portal_id, dt.name
  ) AS tag_stats
  GROUP BY portal_id
), dc AS (
  SELECT
    portal_id,
    array_agg(json_build_object(
      'name', category,
      'datasetCount', count
    )) AS categories
  FROM (
    SELECT
      portal_id,
      dc.name AS category,
      COUNT(dataset_id)
    FROM dataset_category_xref AS dcx
    INNER JOIN ds ON dataset_id = ds.id
    LEFT JOIN dataset_category AS dc ON dc.id = dcx.dataset_category_id
    GROUP BY portal_id, dc.name
  ) AS category_stats
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
    FROM ds
    LEFT JOIN dataset_publisher AS p ON p.id = ds.publisher_id
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
  dt.tags,
  dc.categories,
  dp.publishers,
  ds_stats.count AS dataset_count
FROM portal AS p
LEFT JOIN public.location AS l ON l.id = p.location_id
LEFT JOIN platform AS pl ON pl.id = p.platform_id
LEFT JOIN dt ON dt.portal_id = p.id
LEFT JOIN dc ON dc.portal_id = p.id
LEFT JOIN dp ON dp.portal_id = p.id
LEFT JOIN (
  SELECT
    portal_id,
    COUNT(id)
  FROM ds
  GROUP BY portal_id
) AS ds_stats ON ds_stats.portal_id = p.id
