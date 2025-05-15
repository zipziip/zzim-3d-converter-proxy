const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/luma', async (req, res) => {
  const { imageUrl, prompt, model } = req.body;
  const apiKey = req.headers.authorization.split(' ')[1];

  try {
    const response = await axios.post('https://api.lumalabs.ai/v1/video', {
      image_url: imageUrl,
      prompt,
      model
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    res.json({ videoUrl: response.data.video_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
