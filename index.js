const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();
app.use(express.json());

// ✅ Serve all static files (HTML, CSS, images, etc.)
app.use(express.static(__dirname));

// ✅ Route for testing interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-chat.html'));
});

// ✅ Route for bubble-style widget interface
app.get('/widget', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat-widget.html'));
});

// 💬 Handle AI chat messages
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-1106-preview',
        messages: [
          {
            role: 'system',
            content: `You are Steady Scaling AI — a calm, emotionally intelligent consultant focused on helping people scale through smart spreadsheets, automation, and clean ad systems. You ask thoughtful questions to uncover where someone’s tracking, lead flow, follow-up, or backend is breaking down — whether that’s messy spreadsheets, manual processes, or unoptimized ads.

Never solve their problems directly. Just listen, reflect clearly, and guide them to tap the “Request an Estimate” button.

If the conversation goes beyond 3–4 messages or the user seems warm, begin closing. Say something like: “We’re about to wrap up — tap the button above and Josh will take it from here.”

Keep tone grounded, human, and confident. Use phrases like “Totally hear you” and “That’s super common.”`
          },
          {
            role: 'user',
            content: userMessage
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('OpenAI error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate response.' });
  }
});

// 🟢 Start the bot
app.listen(PORT, () => {
  console.log(`🤖 AI bot live at http://localhost:${PORT}`);
});
