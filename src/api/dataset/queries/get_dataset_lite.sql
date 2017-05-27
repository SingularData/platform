WITH match AS (
  SELECT DISTINCT ON (uuid)
    id AS dataset_id
  FROM dataset
  WHERE uuid = any($1::text[])
  ORDER BY uuid, version_number DESC
), match_tag AS (
  SELECT
    dtx.dataset_id,
    (array_agg(t.name ORDER BY t.name))[1:5] AS tags
  FROM dataset_tag_xref dtx
  INNER JOIN match m ON m.dataset_id = dtx.dataset_id
  LEFT JOIN dataset_tag t ON t.id = dtx.dataset_tag_id
  GROUP BY dtx.dataset_id
)
SELECT
  d.uuid,
  d.name,
  d.description,
  p.name AS portal,
  d.portal_link,
  mt.tags
FROM dataset d
INNER JOIN match m ON m.dataset_id = d.id
LEFT JOIN portal AS p ON p.id = d.portal_id
LEFT JOIN match_tag mt ON mt.dataset_id = d.id
