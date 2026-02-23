const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// In-memory messages storage (restarts empty) or we could use fs
const messagesFilePath = path.join(__dirname, 'messages.json');

// Initialize messages.json if not exists
if (!fs.existsSync(messagesFilePath)) {
    fs.writeFileSync(messagesFilePath, JSON.stringify([]));
}

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const newMessage = {
        id: Date.now(),
        name,
        email,
        message,
        timestamp: new Date().toISOString()
    };

    try {
        const data = fs.readFileSync(messagesFilePath);
        const messages = JSON.parse(data);
        messages.push(newMessage);
        fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));

        console.log(`[Backend] New message received from: ${name} (${email})`);

        // Simulate a "Replying" logic
        const replyText = `Hi ${name.split(' ')[0]}! Vignesh has received your message. He'll vibe back to you at ${email} soon!`;

        res.status(200).json({
            success: true,
            message: 'Received securely!',
            autoReply: replyText
        });
    } catch (err) {
        console.error('Error saving message:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Vibe Coder Backend running at http://localhost:${PORT}`);
    console.log(`Any messages sent from the portfolio will appear here.`);
});
