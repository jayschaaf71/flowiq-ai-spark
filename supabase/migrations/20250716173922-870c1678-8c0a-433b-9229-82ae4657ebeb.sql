-- Update existing plaud source references to be more generic
UPDATE voice_recordings 
SET source = 'Voice Recording' 
WHERE source = 'plaud';