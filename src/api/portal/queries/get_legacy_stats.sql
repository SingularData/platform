SELECT
  p.name,
  p.url,
  p.description,
  pl.name AS platform,
  l.name AS location,
  ph.dataset_count,
  ph.tags,
  ph.categories,
  ph.publishers
FROM legacy.portal_history AS ph
LEFT JOIN public.portal AS p ON p.id = ph.portal_id
LEFT JOIN public.location AS l ON l.id = p.location_id
LEFT JOIN platform AS pl ON pl.id = p.platform_id
WHERE period @> $1::timestamptz
