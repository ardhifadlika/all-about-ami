import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Supabase Client (Server-side only)
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  let supabase: any = null;
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Increase payload limit for base64 images
  app.use(express.json({ limit: "50mb" }));

  // API Routes
  app.post("/api/upload-reaction", async (req, res) => {
    try {
      if (!supabase) {
        return res.status(500).json({ error: "Supabase not configured. Please add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your secrets." });
      }

      const { image, filename } = req.body;
      if (!image) {
        return res.status(400).json({ error: "No image data provided" });
      }

      // Remove base64 prefix
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Upload to Supabase Storage
      // Assuming a bucket named 'reactions' exists
      const { data, error } = await supabase.storage
        .from("reactions")
        .upload(`ami_birthday/${filename || `reaction_${Date.now()}.png`}`, buffer, {
          contentType: "image/png",
          upsert: true,
        });

      if (error) throw error;

      // Get Public URL
      const { data: urlData } = supabase.storage
        .from("reactions")
        .getPublicUrl(data.path);

      res.json({ success: true, url: urlData.publicUrl });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if (!supabase) {
      console.warn("⚠️ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. Uploads will fail.");
    }
  });
}

startServer();
