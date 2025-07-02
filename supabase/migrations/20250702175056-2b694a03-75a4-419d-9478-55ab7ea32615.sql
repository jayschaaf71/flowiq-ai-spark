-- Insert sample data (remove ON CONFLICT for now)

-- Insert sample patients using existing table structure
INSERT INTO public.patients (
  first_name, last_name, email, phone, date_of_birth, gender,
  address_line1, city, state, zip_code, emergency_contact_name, emergency_contact_phone
) VALUES
('John', 'Smith', 'john.smith@example.com', '555-1001', '1985-03-15', 'Male', 
 '123 Main St', 'Springfield', 'IL', '62701', 'Jane Smith', '555-1011'),
('Sarah', 'Davis', 'sarah.davis@example.com', '555-1002', '1978-07-22', 'Female', 
 '456 Oak Ave', 'Springfield', 'IL', '62702', 'Tom Davis', '555-1012'),
('Michael', 'Brown', 'michael.brown@example.com', '555-1003', '1990-11-08', 'Male', 
 '789 Pine St', 'Springfield', 'IL', '62703', 'Lisa Brown', '555-1013');