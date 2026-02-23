module.exports = (req, res) => {
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

    if (req.method === 'POST') {
        try {
            const { name, email, message } = req.body;

            if (!name || !email || !message) {
                return res.status(400).json({ success: false, error: 'All fields (name, email, message) are required' });
            }

            // In Vercel (read-only), we just log the message. 
            // In a real production app, you would send an email or save to a DB here.
            console.log(`Contact Form: ${name} <${email}>: ${message}`);

            const firstName = name.split(' ')[0] || 'there';
            const replyText = `Hi ${firstName}! Vignesh has received your message. He'll vibe back to you at ${email} soon!`;

            return res.status(200).json({
                success: true,
                message: 'Message received by the server!',
                autoReply: replyText
            });
        } catch (error) {
            console.error('API Error:', error);
            return res.status(500).json({ success: false, error: 'Internal Server Error during processing' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
};
