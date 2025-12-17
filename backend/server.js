const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const PRESETS = require("./presets");

const PORT = 3001;
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// ======================
// 基础设置
// ======================
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

let imageHistory = [];

app.use("/uploads", express.static(uploadsDir));

// ======================
// 上传接口
// ======================
app.post("/api/images/upload", upload.single("image"), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ message: "No file uploaded" });

  const item = {
    id: String(imageHistory.length + 1),
    original_name: file.filename,
    original_url: `http://localhost:${PORT}/uploads/${file.filename}`,
    enhanced_url: "",
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  imageHistory.push(item);
  res.json(item);
});

// ======================
// 输出格式统一处理
// ======================
function applyFormat(instance, format) {
  if (format === "png") return instance.png();
  if (format === "webp") return instance.webp({ quality: 92 });

  return instance.jpeg({
    quality: 92,
    chromaSubsampling: "4:4:4",
    progressive: true,
  });
}

// ======================
// 转换接口（preset 版）
// ======================
app.post("/api/images/convert", async (req, res) => {
  const { id, preset = "portrait_clear" } = req.body;

  const index = imageHistory.findIndex((i) => i.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Image not found" });
  }

  const item = imageHistory[index];
  const originalPath = path.join(uploadsDir, item.original_name);

  const config = PRESETS[preset] || PRESETS.portrait_clear;

  try {
    const image = sharp(originalPath);
    const metadata = await image.metadata();
    const { width, format } = metadata;

    const baseName = path.parse(item.original_name).name;
    const ext = format === "jpeg" ? ".jpg" : `.${format}`;
    const enhancedName = `${baseName}-${preset}${ext}`;
    const enhancedPath = path.join(uploadsDir, enhancedName);

    let instance = image;

    if (config.median > 0) {
      instance = instance.median(config.median);
    }

    instance = instance
      .resize({
        width: Math.round(width * config.scale),
        kernel: sharp.kernel.lanczos3,
      })
      .sharpen(config.sharpen)
      .modulate(config.modulate);

    instance = applyFormat(instance, format);

    await instance.toFile(enhancedPath);

    imageHistory[index] = {
      ...item,
      enhanced_url: `http://localhost:${PORT}/uploads/${enhancedName}`,
      status: "success",
      updated_at: new Date().toISOString(),
    };

    res.json(imageHistory[index]);
  } catch (err) {
    console.error("Convert failed:", err);
    res.status(500).json({ message: "Convert failed" });
  }
});

// ======================
// 其他接口
// ======================
app.get("/api/images", (_, res) => res.json(imageHistory));

app.get("/api/images/:id", (req, res) => {
  const image = imageHistory.find((img) => img.id === req.params.id);
  if (!image) return res.status(404).json({ message: "Image not found" });
  res.json(image);
});

// ======================
app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});
