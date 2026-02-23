// api/contact.js - Bulletproof version for Vercel
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 1. Manually check and parse body if Vercel didn't do it automatically
        let body = req.body;
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (e) {
                console.error("JSON Parse Error:", e);
                // Keep body as is or handle error
            }
        }

        // 2. Destructure with a fallback to avoid "Cannot destructure property... of undefined"
        const { name, email, message } = body || {};

        // 3. Robust validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'All fields (name, email, message) are required',
                debug: { hasName: !!name, hasEmail: !!email, hasMessage: !!message }
            });
        }

        // Note: fs.writeFileSync will not work on Vercel as it's read-only.
        // We just log to Vercel console
        console.log(`[Vercel API] New message received from: ${name} (${email})`);

        const firstName = typeof name === 'string' ? name.split(' ')[0] : 'Friend';
        const replyText = `Hi ${firstName}! Vignesh has received your message. He'll vibe back to you at ${email} soon!`;

        return res.status(200).json({
            success: true,
            message: 'Received securely!',
            autoReply: replyText
        });
    } catch (error) {
        console.error('API Runtime Error:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error during processing' });
    }
};
