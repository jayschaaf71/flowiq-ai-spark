-- Create demo providers for both practices
INSERT INTO public.providers (
  first_name,
  last_name,
  email,
  phone,
  specialty,
  license_number,
  npi_number,
  tenant_id,
  is_active
) VALUES 
-- Midwest Dental Sleep Medicine Institute providers
(
  'Dr. Sarah',
  'Johnson',
  'sarah.johnson@midwestdentalsleep.com',
  '314-555-0101',
  'dental-sleep-medicine',
  'DDS-MO-12345',
  '1234567890',
  'd52278c3-bf0d-4731-bfa9-a40f032fa305',
  true
),
(
  'Dr. Michael',
  'Chen',
  'michael.chen@midwestdentalsleep.com',
  '314-555-0102',
  'dental-sleep-medicine',
  'DDS-MO-12346',
  '1234567891',
  'd52278c3-bf0d-4731-bfa9-a40f032fa305',
  true
),
-- West County Spine and Joint providers
(
  'Dr. Jennifer',
  'Martinez',
  'jennifer.martinez@westcountyspine.com',
  '636-555-0201',
  'chiropractic-care',
  'DC-MO-54321',
  '9876543210',
  '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
  true
),
(
  'Dr. Robert',
  'Thompson',
  'robert.thompson@westcountyspine.com',
  '636-555-0202',
  'chiropractic-care',
  'DC-MO-54322',
  '9876543211',
  '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
  true
);