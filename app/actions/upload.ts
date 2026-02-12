"use server";

import { createServiceClient } from "@/lib/supabase/service";

const BUCKET = "product-images";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

/** Upload a product image to Supabase Storage. Returns the public URL or an error. */
export async function uploadProductImage(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file") as File | null;
  if (!file || !(file instanceof File)) {
    return { error: "Aucun fichier." };
  }
  if (file.size > MAX_SIZE) {
    return { error: "Fichier trop volumineux (max 5 Mo)." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Type non autorisé (JPEG, PNG, GIF, WebP uniquement)." };
  }

  const supabase = createServiceClient();

  // Ensure bucket exists (create if not; ignore "already exists" errors)
  const { error: bucketError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: MAX_SIZE,
    allowedMimeTypes: ALLOWED_TYPES,
  });
  if (bucketError && bucketError.message !== "The resource already exists") {
    // Bucket may already exist from Dashboard; continue to upload
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return { error: error.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return { url: publicUrl };
}
