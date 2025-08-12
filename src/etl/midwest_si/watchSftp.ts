import { Client } from 'ssh2-sftp-client';

interface SftpConfig {
  host: string;
  username: string;
  privateKey: string;
}

export async function watchSftpForFiles(config: SftpConfig): Promise<string[]> {
  const sftp = new Client();
  
  try {
    await sftp.connect({
      host: config.host,
      username: config.username,
      privateKey: config.privateKey.replace(/\\n/g, '\n'),
      readyTimeout: 99999,
      algorithms: {
        kex: ['diffie-hellman-group14-sha256', 'diffie-hellman-group1-sha1'],
        cipher: ['aes128-ctr', 'aes192-ctr', 'aes256-ctr', 'aes128-gcm', 'aes256-gcm'],
        serverHostKey: ['ssh-rsa', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', 'ecdsa-sha2-nistp521'],
        hmac: ['hmac-sha2-256', 'hmac-sha2-512', 'hmac-sha1']
      }
    });

    console.log('Connected to SFTP server');
    
    // List files in the root directory
    const files = await sftp.list('/');
    console.log('Files found:', files);
    
    // Look for CSV files
    const csvFiles = files
      .filter(file => file.name.endsWith('.csv'))
      .map(file => file.name);
    
    return csvFiles;
    
  } catch (error) {
    console.error('SFTP connection error:', error);
    throw error;
  } finally {
    await sftp.end();
  }
}

export async function downloadAndArchiveFile(
  config: SftpConfig, 
  fileName: string
): Promise<Buffer> {
  const sftp = new Client();
  
  try {
    await sftp.connect({
      host: config.host,
      username: config.username,
      privateKey: config.privateKey.replace(/\\n/g, '\n'),
      readyTimeout: 99999,
      algorithms: {
        kex: ['diffie-hellman-group14-sha256', 'diffie-hellman-group1-sha1'],
        cipher: ['aes128-ctr', 'aes192-ctr', 'aes256-ctr', 'aes128-gcm', 'aes256-gcm'],
        serverHostKey: ['ssh-rsa', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', 'ecdsa-sha2-nistp521'],
        hmac: ['hmac-sha2-256', 'hmac-sha2-512', 'hmac-sha1']
      }
    });

    // Download file
    const fileBuffer = await sftp.get(`/${fileName}`) as Buffer;
    
    // Create archive directory if it doesn't exist
    const archiveDir = '/archive';
    try {
      await sftp.mkdir(archiveDir);
    } catch (error) {
      // Directory might already exist
      console.log('Archive directory already exists or creation failed:', error);
    }
    
    // Move file to archive
    await sftp.rename(`/${fileName}`, `${archiveDir}/${fileName}`);
    
    console.log(`File ${fileName} downloaded and archived`);
    return fileBuffer;
    
  } catch (error) {
    console.error(`Error processing file ${fileName}:`, error);
    throw error;
  } finally {
    await sftp.end();
  }
}
