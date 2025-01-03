const http = require('http');

// Course content structure
const courseContent = {
    welcome: {
        image: 'https://placehold.co/1200x630/1a1a1a/ffffff/png?text=Welcome+to+SKENAI+Academy',
        title: 'Welcome to SKENAI Academy',
        description: 'Learn about Web3 and DAOs',
        buttons: [
            { text: 'Start Learning' },
            { text: 'View Curriculum' }
        ],
        nextState: 'lesson1'
    },
    lesson1: {
        image: 'https://placehold.co/1200x630/1a1a1a/ffffff/png?text=Lesson+1:+What+is+a+DAO?',
        title: 'Lesson 1: What is a DAO?',
        description: 'Understanding Decentralized Autonomous Organizations',
        buttons: [
            { text: 'Continue' },
            { text: 'Take Quiz' }
        ],
        nextState: 'lesson1_quiz'
    },
    lesson1_quiz: {
        image: 'https://placehold.co/1200x630/1a1a1a/ffffff/png?text=Quiz:+DAO+Basics',
        title: 'Quiz: DAO Basics',
        description: 'Test your knowledge',
        buttons: [
            { text: 'Traditional Company' },
            { text: 'Decentralized Organization' }
        ],
        correctAnswer: 2,
        nextState: 'lesson2'
    },
    lesson2: {
        image: 'https://placehold.co/1200x630/1a1a1a/ffffff/png?text=Lesson+2:+SKENAI+Features',
        title: 'Lesson 2: SKENAI Features',
        description: 'Exploring SKENAI DAO capabilities',
        buttons: [
            { text: 'Continue' },
            { text: 'Take Quiz' }
        ],
        nextState: 'lesson2_quiz'
    },
    lesson2_quiz: {
        image: 'https://placehold.co/1200x630/1a1a1a/ffffff/png?text=Quiz:+SKENAI+Features',
        title: 'Quiz: SKENAI Features',
        description: 'Test your knowledge',
        buttons: [
            { text: 'Governance Only' },
            { text: 'Full DAO Suite' }
        ],
        correctAnswer: 2,
        nextState: 'completion'
    },
    completion: {
        image: 'https://placehold.co/1200x630/1a1a1a/ffffff/png?text=Course+Completed!',
        title: 'Congratulations!',
        description: 'You\'ve completed the SKENAI basics course',
        buttons: [
            { text: 'Get Certificate' },
            { text: 'Start Next Course' }
        ]
    }
};

function generateFrameHtml(state = 'welcome', message = '') {
    const content = courseContent[state];
    const postUrl = 'https://skenai-frames-1.onrender.com/frames/training';
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${content.title}</title>
    <meta property="og:title" content="${content.title}" />
    <meta property="og:image" content="${content.image}" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${content.image}" />
    ${content.buttons.map((btn, index) => 
        `<meta property="fc:frame:button:${index + 1}" content="${btn.text}" />`
    ).join('\n    ')}
    ${message ? `<meta property="fc:frame:state" content="${message}" />` : ''}
    <meta property="fc:frame:post_url" content="${postUrl}" />
    <meta property="fc:frame:aspect_ratio" content="1.91:1" />
</head>
<body>
    <h1>${content.title}</h1>
    <p>${content.description}</p>
    <img src="${content.image}" alt="${content.title}" style="width: 100%; max-width: 1200px;">
</body>
</html>`;
}

const server = http.createServer((req, res) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.url}`);
    
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.url === '/frames/training') {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', () => {
                console.log('POST body:', body);
                let currentState = 'welcome';
                let message = '';
                
                try {
                    const data = JSON.parse(body);
                    const buttonIndex = data?.untrustedData?.buttonIndex;
                    currentState = data?.untrustedData?.state || 'welcome';
                    
                    const content = courseContent[currentState];
                    
                    // Handle quiz answers
                    if (currentState.includes('quiz')) {
                        if (buttonIndex === content.correctAnswer) {
                            message = '✅ Correct! Moving to next lesson...';
                            currentState = content.nextState;
                        } else {
                            message = '❌ Try again!';
                        }
                    } else if (buttonIndex === 1 && content.nextState) {
                        currentState = content.nextState;
                    }
                    
                } catch (e) {
                    console.error('Error processing request:', e);
                }
                
                const html = generateFrameHtml(currentState, message);
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
                });
                res.end(html);
            });
        } else {
            const html = generateFrameHtml();
            res.writeHead(200, {
                'Content-Type': 'text/html',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            });
            res.end(html);
        }
    } else if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'healthy', timestamp }));
    } else if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>SKENAI Academy</h1><p>Interactive learning platform. Visit <a href="/frames/training">/frames/training</a> to start.</p>');
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
