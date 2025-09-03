import express from "express";
import cors from "cors";
import multer from "multer";
import crypto from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config({ path: "./backend/.env" });

const PORT = 8000;
const app = express();
app.use(cors());

// Calling mediawiki api to obtain searched sheets
app.get("/api/imslp", async (req, res) => {
  try {
    const { q, offset = 0 } = req.query;
    const r = await fetch(
      `https://imslp.org/api.php?action=query&list=search&format=json&srsearch=${encodeURIComponent(
        q
      )}&sroffset=${offset}&srlimit=200`
    );
    const data = await r.json();

    res.json(data);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// multer related
const storage = multer.memoryStorage(); // keeps file in memory
const upload = multer({ storage });
const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});
function randomImageName(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

app.post(
  "/api/uploadProfilePicture",
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;
      // the file object contains: buffer (file data), originalname, mimetype
      // we'd like to send the object's buffer (file data) to the s3 bucket.
      const imageName = randomImageName();
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
      const command = new PutObjectCommand(params);
      await s3.send(command);

      // returning the URL
      const url = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${imageName}`;
      res.json({ url });
    } catch (err) {
      res.json({ error: err.message });
    }
  }
);

app.listen(PORT, () => console.log(`server is running on ${PORT}`));
