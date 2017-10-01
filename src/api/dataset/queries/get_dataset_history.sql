SELECT
  array_agg(json_build_object(
    'identifier', d.identifier,
    'version', d.version,
    'modified', lower(d.version_period)
  ) ORDER BY d.version DESC) AS version_history
FROM dataset AS d
LEFT JOIN dataset_portal_xref AS dpx ON dpx.dataset_id = d.id
WHERE
  d.portal_dataset_id = $2::text AND
  dpx.portal_id = $1::integer;
