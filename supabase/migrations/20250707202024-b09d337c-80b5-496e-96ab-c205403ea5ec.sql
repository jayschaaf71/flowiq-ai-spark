-- Insert default providers for West County Spine and Joint
INSERT INTO providers (first_name, last_name, specialty, email, phone, is_active) VALUES 
('Dr. Sarah', 'Johnson', 'Chiropractor', 'sarah.johnson@westcountyspine.com', '(555) 123-4567', true),
('Dr. Michael', 'Chen', 'Chiropractor', 'michael.chen@westcountyspine.com', '(555) 123-4568', true),
('Dr. Lisa', 'Rodriguez', 'Chiropractor', 'lisa.rodriguez@westcountyspine.com', '(555) 123-4569', true);

-- Add some sample provider schedules for Monday (1) through Friday (5)
INSERT INTO provider_schedules (provider_id, day_of_week, start_time, end_time, break_start_time, break_end_time, is_available)
SELECT 
    p.id as provider_id,
    d.day_of_week,
    '09:00' as start_time,
    '17:00' as end_time,
    '12:00' as break_start_time,
    '13:00' as break_end_time,
    true as is_available
FROM providers p
CROSS JOIN (
    SELECT 1 as day_of_week UNION ALL
    SELECT 2 UNION ALL
    SELECT 3 UNION ALL
    SELECT 4 UNION ALL
    SELECT 5
) d
WHERE p.is_active = true;