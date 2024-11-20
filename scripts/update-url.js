const fs = require('fs');
const path = require('path');

// Função para atualizar o .env.local
function updateEnv(url) {
    const envPath = path.join(__dirname, '../.env.local');
    let content = fs.readFileSync(envPath, 'utf-8');
    
    // Atualiza as URLs
    content = content.replace(/NEXT_PUBLIC_APP_URL=.*$/m, `NEXT_PUBLIC_APP_URL="${url}"`);
    content = content.replace(/NEXT_PUBLIC_API_URL=.*$/m, `NEXT_PUBLIC_API_URL="${url}/api"`);
    
    fs.writeFileSync(envPath, content);
    console.log('\n====================================');
    console.log('🌍 URL Pública:', url);
    console.log('📊 Dashboard: http://localhost:4040');
    console.log('====================================\n');
}

// Lê a URL do ngrok da entrada padrão
process.stdin.setEncoding('utf8');
process.stdin.on('data', (data) => {
    const match = data.toString().match(/Forwarding\s+(https:\/\/[^->]+)/);
    if (match) {
        const url = match[1].trim();
        updateEnv(url);
    }
});
