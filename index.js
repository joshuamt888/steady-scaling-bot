const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Remove dotenv import since you're not using .env anymore
// require('dotenv').config(); // REMOVE THIS LINE

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
            content: `You are Steady Scaling AI — a calm, emotionally intelligent consultant focused on helping people scale through`,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Use environment variable
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing the request.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
