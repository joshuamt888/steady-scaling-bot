const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors'); // ✅ Import CORS

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Enable CORS for all routes
app.use(cors());

// ✅ Parse JSON request bodies
app.use(express.json());

// ✅ Serve static files (HTML, CSS, etc.)
app.use(express.static(__dirname));

// ✅ Serve chat UIs
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-chat.html'));
});

app.get('/widget', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat-widget.html'));
});

// ✅ Chat handler route
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Missing OpenAI API Key in environment.' });
  }

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

Keep tone grounded, human, and confident. Use phrases like “Totally hear you” and “That’s super common.”`,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('OpenAI Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error from AI server.' });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
