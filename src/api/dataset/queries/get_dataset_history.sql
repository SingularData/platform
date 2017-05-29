SELECT
  version_number AS version,
  lower(version_period) AS updated_time
FROM dataset
WHERE uuid = $1::text
ORDER BY version_number DESC
