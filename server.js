const http = require('http');

function generateFrameHtml(baseUrl) {
    // Using a reliable image hosting service
    const imageUrl = 'https://placehold.co/1200x630/1a1a1a/ffffff/png?text=SKENAI+Training';
    const postUrl = `${baseUrl}/frames/training`;
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SKENAI Training Frame</title>
    <meta property="og:title" content="SKENAI Training" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imageUrl}" />
    <meta property="fc:frame:button:1" content="Start Training" />
    <meta property="fc:frame:button:2" content="View Progress" />
    <meta property="fc:frame:post_url" content="${postUrl}" />
    <meta property="fc:frame:aspect_ratio" content="1.91:1" />
</head>
<body>
    <img src="${imageUrl}" alt="SKENAI Training" style="width: 100%; max-width: 1200px;">
    <p>Server is running!</p>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.url}`);
    
    // Get base URL from request headers
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const baseUrl = `${protocol}://${host}`;
    
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.url === '/frames/training') {
        const html = generateFrameHtml(baseUrl);
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        res.end(html);
    } else if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'healthy', timestamp }));
    } else if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>SKENAI Frames Server</h1><p>Server is running! Try <a href="/frames/training">/frames/training</a></p>');
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  - GET  /              (Home page)');
    console.log('  - GET  /frames/training (Frame endpoint)');
    console.log('  - GET  /health        (Health check)');
});
