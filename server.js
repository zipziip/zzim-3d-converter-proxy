import express from "express";
import cors from "cors";
import multer from "multer";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
app.use(cors());
app.use(express.json());

app.post("/upload", upload.array("files"), async (req, res) => {
  const { userId, pointz } = req.body;
  const files = req.files;
  const totalCost = files.length * parseInt(pointz);

  try {
    // 1️⃣ Cloudinary에 이미지 업로드 (첫 번째 파일만 예시로 사용)
    const formData = new FormData();
    formData.append("file", `data:image/png;base64,${files[0].buffer.toString("base64")}`);
    formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);

    const cloudinaryRes = await axios.post(process.env.CLOUDINARY_UPLOAD_URL, formData, {
      headers: formData.getHeaders()
    });

    const imageUrl = cloudinaryRes.data.secure_url;

    // 2️⃣ Luma API에 이미지로 video 생성
    const lumaRes = await axios.post(
      "https://api.luma.ai/ray/generate",
      {
        image_url: imageUrl,
        mode: "video",
        duration: "9s",
        quality: "low"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LUMA_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const videoUrl = lumaRes.data?.video_url || "https://example.com/fake-video.mp4";

    // 3️⃣ Wix 백엔드 함수 호출 (planz 차감)
    await axios.post(process.env.WIX_API_URL, {
      userId,
      pointz: totalCost
    });

    // 4️⃣ 최종 반환
    res.json({ videoUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
