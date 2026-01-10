export const uploadToCloudinary = async (file: File, folder = "users/profile_pictures") => {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET || "");
  formData.append("folder", folder);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) throw new Error("Cloudinary cloud name is missing");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.secure_url as string;
};

// New helper (non-breaking) to upload multiple files sequentially.
// Returns array of secure URLs in same order. Existing single-file function kept intact.
export const uploadFilesToCloudinary = async (files: File[], folder = "users/profile_pictures") => {
  const results: string[] = [];
  for (const f of files) {
    const url = await uploadToCloudinary(f, folder);
    results.push(url);
  }
  return results;
};
