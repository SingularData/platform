SELECT
  version,
  lower(version_period) AS updated
FROM dataset
WHERE uuid = $1::text
ORDER BY version DESC
