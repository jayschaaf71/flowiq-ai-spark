import { NextApiRequest, NextApiResponse } from 'next';
import { watchSftpForFiles, downloadAndArchiveFile } from '../../../etl/midwest_si/watchSftp';
import { routeAndIngestFile } from '../../../etl/midwest_si/ingest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify environment variables
    const sftpHost = process.env.SFTP_HOST;
    const sftpUsername = process.env.SFTP_USERNAME;
    const sftpPrivateKey = process.env.SFTP_PRIVATE_KEY;

    if (!sftpHost || !sftpUsername || !sftpPrivateKey) {
      console.error('Missing SFTP environment variables');
      return res.status(500).json({ 
        error: 'Missing SFTP configuration',
        missing: {
          host: !sftpHost,
          username: !sftpUsername,
          privateKey: !sftpPrivateKey
        }
      });
    }

    console.log('Starting Sleep Impressions ETL process...');
    console.log('SFTP Host:', sftpHost);
    console.log('SFTP Username:', sftpUsername);

    const sftpConfig = {
      host: sftpHost,
      username: sftpUsername,
      privateKey: sftpPrivateKey
    };

    // Check for new files on SFTP server
    const csvFiles = await watchSftpForFiles(sftpConfig);
    console.log(`Found ${csvFiles.length} CSV files:`, csvFiles);

    const processedFiles = [];
    const errors = [];

    // Process each CSV file
    for (const fileName of csvFiles) {
      try {
        console.log(`Processing file: ${fileName}`);
        
        // Download and archive the file
        const fileBuffer = await downloadAndArchiveFile(sftpConfig, fileName);
        
        // Ingest the file data
        await routeAndIngestFile(fileName, fileBuffer);
        
        processedFiles.push(fileName);
        console.log(`Successfully processed: ${fileName}`);
        
      } catch (fileError) {
        console.error(`Error processing file ${fileName}:`, fileError);
        errors.push({
          fileName,
          error: fileError instanceof Error ? fileError.message : String(fileError)
        });
      }
    }

    // Return results
    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      filesFound: csvFiles.length,
      filesProcessed: processedFiles.length,
      processedFiles,
      errors: errors.length > 0 ? errors : undefined
    };

    console.log('ETL process completed:', result);
    
    return res.status(200).json(result);

  } catch (error) {
    console.error('ETL process failed:', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    });
  }
}

// Configure API route to handle larger payloads and longer timeouts
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false,
  },
  maxDuration: 300, // 5 minutes for Vercel Pro
}
