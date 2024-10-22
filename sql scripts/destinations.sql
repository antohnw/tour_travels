-- Add constraints 
SELECT 
    conname AS constraint_name,
    contype AS constraint_type,
    conrelid::regclass AS table_name,
    a.attname AS column_name
FROM 
    pg_constraint AS c
JOIN 
    pg_attribute AS a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
WHERE 
    conrelid = 'destinations'::regclass;  SELECT 
    conname AS constraint_name,
    contype AS constraint_type,
    conrelid::regclass AS table_name,
    a.attname AS column_name
FROM 
    pg_constraint AS c
JOIN 
    pg_attribute AS a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
WHERE 
    conrelid = 'destinations'::regclass; 


-- ALTER TABLE destinations
-- ADD CONSTRAINT unique_destination_country
-- UNIQUE (destination_name, country);