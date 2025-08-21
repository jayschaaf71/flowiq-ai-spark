import Client from 'ssh2-sftp-client';
import Papa from 'papaparse';
import 'dotenv/config';

async function testETL() {
  console.log('🚀 Starting Sleep Impressions ETL Test...');

  const sftp = new Client();

  try {
    // Connect to SFTP
    await sftp.connect({
      host: process.env.SFTP_HOST,
      username: process.env.SFTP_USERNAME,
      privateKey: process.env.SFTP_PRIVATE_KEY.replace(/\\n/g, '\n'),
      readyTimeout: 99999
    });

    console.log('✅ Connected to SFTP server');

    // List files
    const files = await sftp.list('/');
    console.log('📁 Files on server:', files.map(f => f.name));

    // Look for CSV files
    const csvFiles = files
      .filter(file => file.name.endsWith('.csv'))
      .map(file => file.name);

    console.log('📊 Found CSV files:', csvFiles);

    // Process each CSV file
    for (const fileName of csvFiles) {
      try {
        console.log(`\n🔄 Processing: ${fileName}`);

        // Download file
        const fileBuffer = await sftp.get(`/${fileName}`);
        const csvContent = fileBuffer.toString('utf-8');

        // Parse CSV
        const parseResult = Papa.parse(csvContent, { header: true, skipEmptyLines: true });

        console.log(`✅ Parsed ${parseResult.data.length} rows from ${fileName}`);
        console.log(`📋 Sample data:`, parseResult.data.slice(0, 2));

      } catch (fileError) {
        console.error(`❌ Error processing ${fileName}:`, fileError.message);
      }
    }

    console.log('\n🎉 ETL Test Complete!');

  } catch (error) {
    console.error('❌ ETL Test Failed:', error);
  } finally {
    await sftp.end();
  }
}

testETL();
