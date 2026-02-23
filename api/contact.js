module.exports = function handler(req, res) {
    if (req.method === 'POST') {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }

        console.log(`[Vercel API] New message received from: ${name} (${email})`);

        // Note: fs.writeFileSync will not work on Vercel as it's read-only.
        // In a real app, you'd use a database or an email service.

        const replyText = `Hi ${name.split(' ')[0]}! Vignesh has received your message. He'll vibe back to you at ${email} soon!`;

        return res.status(200).json({
            success: true,
            message: 'Received securely!',
            autoReply: replyText
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
