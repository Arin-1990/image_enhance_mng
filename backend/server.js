const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const PORT = 3001;
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

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

function applyFormat(instance, format, quality) {
  if (format === "png") return instance.png();
  if (format === "webp") return instance.webp({ quality });
  return instance.jpeg({
    quality,
    chromaSubsampling: "4:4:4",
    progressive: true,
  });
}

app.post("/api/images/convert", async (req, res) => {
  const { id, imageQuality = 80 } = req.body;

  const index = imageHistory.findIndex((i) => i.id === id);
  if (index === -1) return res.status(404).json({ message: "Not found" });

  const item = imageHistory[index];
  const originalPath = path.join(uploadsDir, item.original_name);

  try {
    const image = sharp(originalPath);
    const { width, format } = await image.metadata();

    const baseName = path.parse(item.original_name).name;
    const ext = format === "jpeg" ? ".jpg" : `.${format}`;
    const enhancedName = `${baseName}-enhanced${ext}`;
    const enhancedPath = path.join(uploadsDir, enhancedName);

    let sharpInstance = image;

    if (imageQuality >= 80) {
      sharpInstance = sharpInstance
        .median(1)
        .resize({
          width: Math.round(width * 1.6),
          kernel: sharp.kernel.lanczos3,
        })
        .sharpen({
          sigma: 1.2,
          m1: 1.0,
          m2: 2.0,
          x1: 2,
          y2: 15,
        })
        .modulate({
          brightness: 1.02,
          saturation: 1.05,
        });
    }

    sharpInstance = applyFormat(
      sharpInstance,
      format,
      Math.min(imageQuality, 95)
    );

    await sharpInstance.toFile(enhancedPath);

    imageHistory[index] = {
      ...item,
      enhanced_url: `http://localhost:${PORT}/uploads/${enhancedName}`,
      status: "success",
      updated_at: new Date().toISOString(),
    };

    res.json(imageHistory[index]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Convert failed" });
  }
});

app.get("/api/images", (_, res) => res.json(imageHistory));

app.listen(PORT, () => console.log(`Server running http://localhost:${PORT}`));
