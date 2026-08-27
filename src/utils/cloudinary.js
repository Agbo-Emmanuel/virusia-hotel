export const uploadImageToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  console.log("Cloud Name:", cloudName);
  console.log("Upload Preset:", uploadPreset);

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: data },
  );
  const json = await res.json();

  if (!res.ok) {
    console.log("the issue: ", json);
    throw new Error(json?.error?.message || "Image upload failed");
  }
  return json.secure_url;
};
