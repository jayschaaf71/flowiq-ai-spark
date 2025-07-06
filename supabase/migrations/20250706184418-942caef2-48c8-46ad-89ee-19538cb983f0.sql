-- Check if we have the OPENAI_API_KEY secret configured
SELECT name FROM pg_catalog.pg_settings WHERE name LIKE '%openai%';