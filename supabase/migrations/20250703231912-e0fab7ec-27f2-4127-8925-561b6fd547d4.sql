-- Disable email confirmation requirement
UPDATE auth.config 
SET 
  MAILER_AUTOCONFIRM = 'true',
  SIGNUP_DISABLED = 'false'
WHERE true;