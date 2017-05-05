WITH match AS (
  SELECT
    dataset_id,
    ts_rank(st.keywords, query, 1) AS rank
  FROM
    search_engine.view_search_table AS st,
    plainto_tsquery($1::text) AS query
  WHERE st.keywords @@ query
  OFFSET $2::integer LIMIT $3::integer
), match_tag AS (
  SELECT
    dtx.dataset_id,
    array_agg(t.name) AS tags
  FROM dataset_tag_xref dtx
  JOIN match m ON m.dataset_id = dtx.dataset_id
  LEFT JOIN dataset_tag t ON t.id = dtx.dataset_tag_id
  GROUP BY dtx.dataset_id
), match_category AS (
  SELECT
    dcx.dataset_id,
    array_agg(c.name) AS categories
  FROM dataset_category_xref dcx
  JOIN match m ON m.dataset_id = dcx.dataset_id
  LEFT JOIN dataset_category c ON c.id = dcx.dataset_category_id
  GROUP BY dcx.dataset_id
)
SELECT
  d.portal_dataset_id,
  d.name,
  d.created_time,
  d.updated_time,
  d.description,
  d.portal_link,
  d.data_link,
  d.license,
  p.name AS publisher,
  po.name AS portal,
  pl.name AS platform,
  mt.tags,
  mc.categories
FROM dataset d
INNER JOIN match m ON m.dataset_id = d.id
LEFT JOIN portal po ON d.portal_id = po.id
LEFT JOIN platform pl ON pl.id = po.platform_id
LEFT JOIN dataset_publisher p ON p.id = d.publisher_id
LEFT JOIN match_tag mt ON mt.dataset_id = d.id
LEFT JOIN match_category mc ON mc.dataset_id = d.id
ORDER BY m.rank DESC
