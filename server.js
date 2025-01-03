const http = require('http');

// In-memory user progress storage
const userProgress = new Map();

// Course content structure
const courseContent = {
    welcome: {
        image: 'https://placehold.co/1200x630/1a1a1a/ffffff/png?text=Welcome+to+SKENAI+Academy',
        title: 'Welcome to SKENAI Academy',
        description: 'Learn about Web3 and DAOs',
        buttons: [
            { text: 'Start Learning' },
            { text: 'View Progress' }
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
        description: 'A DAO is a blockchain-based organization where rules are enforced by:',
        buttons: [
            { text: 'Manual Processes' },
            { text: 'Smart Contracts' }
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
        description: 'SKENAI provides:',
        buttons: [
            { text: 'Governance Only' },
            { text: 'Full DAO Suite' }
        ],
        correctAnswer: 2,
        nextState: 'lesson3'
    },
    lesson3: {
        image: 'https://placehold.co/1200x630/1a1a1a/ffffff/png?text=Lesson+3:+Governance',
        title: 'Lesson 3: DAO Governance',
        description: 'Learn about voting mechanisms and proposal creation',
        buttons: [
            { text: 'Continue' },
            { text: 'Take Quiz' }
        ],
        nextState: 'lesson3_quiz'
    },
    lesson3_quiz: {
        image: 'https://placehold.co/1200x630/1a1a1a/ffffff/png?text=Quiz:+Governance',
        title: 'Quiz: DAO Governance',
        description: 'Which voting mechanism provides better security?',
        buttons: [
            { text: 'Single Token, Single Vote' },
            { text: 'Quadratic Voting' }
        ],
        correctAnswer: 2,
        nextState: 'lesson4'
    },
    lesson4: {
        image: 'https://placehold.co/1200x630/1a1a1a/ffffff/png?text=Lesson+4:+Treasury',
        title: 'Lesson 4: DAO Treasury',
        description: 'Managing DAO assets and financial operations',
        buttons: [
            { text: 'Continue' },
            { text: 'Take Quiz' }
        ],
        nextState: 'lesson4_quiz'
    },
    lesson4_quiz: {
        image: 'https://placehold.co/1200x630/1a1a1a/ffffff/png?text=Quiz:+Treasury',
        title: 'Quiz: DAO Treasury',
        description: 'SKENAI treasury supports:',
        buttons: [
            { text: 'Single Token' },
            { text: 'Multi-Asset' }
        ],
        correctAnswer: 2,
        nextState: 'lesson5'
    },
    lesson5: {
        image: 'https://placehold.co/1200x630/1a1a1a/ffffff/png?text=Lesson+5:+Integration',
        title: 'Lesson 5: Yardi Integration',
        description: 'Connecting traditional real estate with Web3',
        buttons: [
            { text: 'Continue' },
            { text: 'Take Quiz' }
        ],
        nextState: 'lesson5_quiz'
    },
    lesson5_quiz: {
        image: 'https://placehold.co/1200x630/1a1a1a/ffffff/png?text=Quiz:+Integration',
        title: 'Quiz: Yardi Integration',
        description: 'SKENAI-Yardi integration enables:',
        buttons: [
            { text: 'Data Viewing Only' },
            { text: 'Full Management' }
        ],
        correctAnswer: 2,
        nextState: 'completion'
    },
    completion: {
        image: 'https://placehold.co/1200x630/1a1a1a/ffffff/png?text=Course+Completed!',
        title: 'Congratulations!',
        description: 'You\'ve completed the SKENAI basics course',
        buttons: [
            { text: 'View Certificate' },
            { text: 'View Progress' }
        ]
    },
    progress: {
        image: 'https://placehold.co/1200x630/1a1a1a/ffffff/png?text=Your+Progress',
        title: 'Learning Progress',
        description: 'Track your journey through SKENAI Academy',
        buttons: [
            { text: 'Continue Learning' },
            { text: 'Share Progress' }
        ]
    }
};

function calculateProgress(userId) {
    const progress = userProgress.get(userId) || { 
        completedLessons: new Set(),
        quizScores: {},
        lastState: 'welcome'
    };
    
    const totalLessons = Object.keys(courseContent).filter(k => k.includes('lesson')).length;
    const completedCount = progress.completedLessons.size;
    const percentage = Math.round((completedCount / totalLessons) * 100);
    
    return { progress, percentage };
}

function generateFrameHtml(state = 'welcome', message = '', userId = null) {
    const content = courseContent[state];
    const postUrl = 'https://skenai-frames-1.onrender.com/frames/training';
    
    let description = content.description;
    if (state === 'progress' && userId) {
        const { percentage } = calculateProgress(userId);
        description = `Course Progress: ${percentage}%\n${description}`;
    }
    
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
    <p>${description}</p>
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
                    const userId = data?.untrustedData?.fid || 'anonymous';
                    currentState = data?.untrustedData?.state || 'welcome';
                    
                    // Initialize or get user progress
                    if (!userProgress.has(userId)) {
                        userProgress.set(userId, {
                            completedLessons: new Set(),
                            quizScores: {},
                            lastState: 'welcome'
                        });
                    }
                    
                    const userState = userProgress.get(userId);
                    const content = courseContent[currentState];
                    
                    // Handle different states
                    if (currentState === 'welcome' && buttonIndex === 2) {
                        currentState = 'progress';
                    } else if (currentState === 'progress' && buttonIndex === 1) {
                        currentState = userState.lastState || 'lesson1';
                    } else if (currentState.includes('quiz')) {
                        if (buttonIndex === content.correctAnswer) {
                            message = '✅ Correct! Moving to next lesson...';
                            currentState = content.nextState;
                            userState.completedLessons.add(currentState);
                            userState.quizScores[currentState] = true;
                        } else {
                            message = '❌ Try again!';
                            userState.quizScores[currentState] = false;
                        }
                    } else if (buttonIndex === 1 && content.nextState) {
                        currentState = content.nextState;
                    }
                    
                    // Update user's last state
                    userState.lastState = currentState;
                    
                    const html = generateFrameHtml(currentState, message, userId);
                    res.writeHead(200, {
                        'Content-Type': 'text/html',
                        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
                    });
                    res.end(html);
                    
                } catch (e) {
                    console.error('Error processing request:', e);
                    const html = generateFrameHtml('welcome', 'Error occurred, starting over');
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(html);
                }
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
