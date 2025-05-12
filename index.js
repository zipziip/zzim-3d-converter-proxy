const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
app.use(cors());
const upload = multer();

app.post('/convert', upload.single('file'), async (req, res) => {
  const file = req.file;
  const prompt = 'minimal low-poly 3D space, smallest possible GLB for fast web loading';

  const formData = new FormData();
  formData.append('image', file.buffer, file.originalname);
  formData.append('prompt', prompt);
  formData.append('output_format', 'glb');
  formData.append('quality', 'low');
  formData.append('duration', '5');

  try {
    const response = await axios.post('https://api.luma.ai/v1/convert', formData, {
      headers: {
        'Authorization': `Bearer ${process.env.LUMA_API_KEY}`,
        ...formData.getHeaders()
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send({ error: 'Conversion failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
