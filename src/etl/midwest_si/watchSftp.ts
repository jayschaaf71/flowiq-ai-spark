import { Client } from 'ssh2-sftp-client';
import { ingestFile } from './ingest';

export default async function handler() {
  const sftp = new Client();
  
  try {
    console.log('Connecting to SFTP server...');
    await sftp.connect({
      host: process.env.SI_SFTP_HOST || 'imports.flowiq.ai',
      username: process.env.SI_SFTP_USER || 'etl_si',
      password: process.env.SI_SFTP_PASS || '',
      port: 22
    });

    console.log('Listing files in /midwest/si...');
    const files = await sftp.list('/midwest/si');
    const csvFiles = files.filter(f => f.name.endsWith('.csv') && !f.name.includes('archive'));
    
    console.log(`Found ${csvFiles.length} CSV files to process`);
    
    for (const file of csvFiles) {
      try {
        console.log(`Processing file: ${file.name}`);
        const buffer = await sftp.get(`/midwest/si/${file.name}`);
        const csvContent = buffer.toString('utf-8');
        
        await ingestFile(file.name, csvContent);
        
        // Archive the file after successful processing
        const archivePath = `/midwest/si/archive/${file.name}`;
        await sftp.rename(`/midwest/si/${file.name}`, archivePath);
        console.log(`Archived ${file.name} to ${archivePath}`);
        
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        // Continue with other files even if one fails
      }
    }
    
  } catch (error) {
    console.error('SFTP connection or processing error:', error);
    throw error;
  } finally {
    sftp.end();
  }
}

// For local testing
if (import.meta.env?.DEV) {
  handler().catch(console.error);
}
