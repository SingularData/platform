WITH ds as (
  SELECT
    d.id,
    d.portal_dataset_id,
    d.name,
    d.description,
    p.name AS publisher,
    po.name AS portal,
    po.url AS portal_url,
    pl.name AS platform,
    d.data_link,
    d.portal_link,
    d.created_time,
    d.updated_time,
    d.license,
    d.description
  FROM dataset AS d
  LEFT JOIN dataset_publisher p ON p.id = d.publisher_id
  LEFT JOIN portal AS po ON po.id = d.portal_id
  LEFT JOIN platform AS pl ON pl.id = po.platform_id
  WHERE d.id = $1::integer
), dc AS (
  SELECT
    dcx.dataset_id,
    array_agg(dc.name) AS categories
  FROM dataset_category_xref AS dcx
  LEFT JOIN dataset_category AS dc ON dc.id = dcx.dataset_category_id
  WHERE dcx.dataset_id = $1::integer
  GROUP BY dcx.dataset_id
), dt AS (
  SELECT
    dtx.dataset_id,
    array_agg(dt.name)AS tags
  FROM dataset_tag_xref AS dtx
  LEFT JOIN dataset_tag AS dt ON dt.id = dtx.dataset_tag_id
  WHERE dtx.dataset_id = $1::integer
  GROUP BY dtx.dataset_id
)
SELECT
  ds.*,
  COALESCE(dt.tags, '{}') AS tags,
  COALESCE(dc.categories, '{}') AS categories
FROM ds
LEFT JOIN dt ON dt.dataset_id = ds.id
LEFT JOIN dc ON dc.dataset_id = ds.id
