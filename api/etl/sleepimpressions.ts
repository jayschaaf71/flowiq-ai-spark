import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Import dependencies here to avoid issues with Vercel bundling
        const { Client } = await import('ssh2-sftp-client');
        const Papa = await import('papaparse');
        const { createClient } = await import('@supabase/supabase-js');

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

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

        const sftp = new Client();

        try {
            await sftp.connect({
                host: sftpHost,
                username: sftpUsername,
                privateKey: sftpPrivateKey.replace(/\\n/g, '\n'),
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

            const processedFiles = [];
            const errors = [];

            // Process each CSV file
            for (const fileName of csvFiles) {
                try {
                    console.log(`Processing file: ${fileName}`);

                    // Download file
                    const fileBuffer = await sftp.get(`/${fileName}`) as Buffer;

                    // Create archive directory if it doesn't exist
                    const archiveDir = '/archive';
                    try {
                        await sftp.mkdir(archiveDir);
                    } catch (error) {
                        console.log('Archive directory already exists or creation failed:', error);
                    }

                    // Move file to archive
                    await sftp.rename(`/${fileName}`, `${archiveDir}/${fileName}`);

                    console.log(`File ${fileName} downloaded and archived`);

                    // Parse CSV
                    const csvContent = fileBuffer.toString('utf-8');
                    const parseResult = Papa.parse(csvContent, { header: true, skipEmptyLines: true });

                    if (parseResult.errors.length > 0) {
                        throw new Error(`CSV parsing errors: ${parseResult.errors.map(e => e.message).join(', ')}`);
                    }

                    const data = parseResult.data as any[];
                    console.log(`Parsed ${data.length} rows from ${fileName}`);

                    // Create ETL log entry
                    const { data: logRecord, error: logError } = await supabase
                        .from('etl_logs')
                        .insert({
                            file_name: fileName,
                            file_type: determineFileType(fileName),
                            status: 'processing'
                        })
                        .select()
                        .single();

                    if (logError) {
                        console.error('Failed to create ETL log:', logError);
                        throw logError;
                    }

                    // Simple processing for now - just log the data
                    console.log(`Successfully processed ${fileName}: ${data.length} records`);

                    // Update ETL log with success
                    await supabase
                        .from('etl_logs')
                        .update({
                            status: 'completed',
                            records_processed: data.length,
                            records_failed: 0,
                            completed_at: new Date().toISOString()
                        })
                        .eq('id', logRecord.id);

                    processedFiles.push(fileName);

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

        } finally {
            await sftp.end();
        }

    } catch (error) {
        console.error('ETL process failed:', error);

        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
    }
}

function determineFileType(fileName: string): string {
    if (fileName.includes('billing_log')) return 'billing_log';
    if (fileName.includes('patient_visit_log')) return 'patient_visit_log';
    if (fileName.includes('insurance_pat_ref')) return 'insurance_pat_ref';
    if (fileName.includes('Claims_Report')) return 'claims_report';
    return 'unknown';
}
