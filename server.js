const http = require('http');

function generateFrameHtml() {
    // Using a reliable image hosting service
    const imageUrl = 'https://placehold.co/1200x630/1a1a1a/ffffff/png?text=SKENAI+Training';
    // This will be updated with the actual deployment URL
    const postUrl = 'https://skenai-frames.onrender.com/frames/training';
    
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
</body>
</html>`;
}

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.url === '/frames/training') {
        const html = generateFrameHtml();
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        res.end(html);
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
