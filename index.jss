const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/get-rules', async (req, res) => {
    const { token, zoneId } = req.body;
    try {
        const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/email/routing/rules`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/create-route', async (req, res) => {
    const { token, zoneId, payload } = req.body;
    try {
        const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/email/routing/rules`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
