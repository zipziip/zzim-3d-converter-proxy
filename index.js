import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const LUMA_API_KEY = process.env.LUMA_API_KEY;

app.post("/generate-multi", async (req, res) => {
  const { imageUrls } = req.body;

  const response = await fetch("https://api.luma.ai/v1/renders", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${LUMA_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      images: imageUrls,
      duration: "9s",
      quality: "low",
      style: "gimbal and drone operated video",
    }),
  });

  const data = await response.json();
  res.json(data);
});

app.get("/status/:id", async (req, res) => {
  const id = req.params.id;
  const response = await fetch(`https://api.luma.ai/v1/renders/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${LUMA_API_KEY}`,
    },
  });
  const data = await response.json();
  res.json(data);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
