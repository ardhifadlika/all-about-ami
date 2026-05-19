import { createClient } from "@supabase/supabase-js";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: "Supabase configuration missing in Environment Variables." });
    }

    // Sanitize URL
    supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { image, filename } = req.body;
    if (!image) {
      return res.status(400).json({ error: "No image data provided" });
    }

    const bucketName = "reactions";
    
    // Remove base64 prefix
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const filePath = `ami_birthday/${filename || `reaction_${Date.now()}.png`}`;
    
    // Upload
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) {
      // If error is 'Bucket not found', attempt to create it (only if service role key allows)
      if (error.message.includes('not found')) {
         await supabase.storage.createBucket(bucketName, { public: true });
         // Retry upload once
         const { data: retryData, error: retryError } = await supabase.storage
           .from(bucketName)
           .upload(filePath, buffer, { contentType: "image/png", upsert: true });
         
         if (retryError) throw retryError;
         
         const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(retryData.path);
         return res.json({ success: true, url: urlData.publicUrl });
      }
      throw error;
    }

    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
    return res.json({ success: true, url: urlData.publicUrl });

  } catch (error: any) {
    console.error("Vercel Upload error:", error);
    return res.status(500).json({ error: error.message });
  }
}
