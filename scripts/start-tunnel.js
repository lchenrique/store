const ngrok = require('ngrok');
const fs = require('fs');
const path = require('path');

async function updateEnvFile(url) {
  const envPath = path.join(__dirname, '../.env.local');
  let envContent = fs.readFileSync(envPath, 'utf-8');
  
  // Update the URLs
  envContent = envContent.replace(
    /NEXT_PUBLIC_APP_URL=.*$/m,
    `NEXT_PUBLIC_APP_URL="${url}"`
  );
  envContent = envContent.replace(
    /NEXT_PUBLIC_API_URL=.*$/m,
    `NEXT_PUBLIC_API_URL="${url}/api"`
  );
  
  fs.writeFileSync(envPath, envContent);
}

async function startTunnel() {
  try {
    const url = await ngrok.connect({
      addr: 3000,
      region: 'sa'
    });
    console.log('🚇 Tunnel Created:', url);
    await updateEnvFile(url);
    console.log('✅ Environment variables updated!');
  } catch (err) {
    console.error('❌ Error creating tunnel:', err);
    process.exit(1);
  }
}

startTunnel();
