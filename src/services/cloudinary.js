// src/services/cloudinary.js

export const uploadMultipleToCloudinary = async (files) => {
  const uploadedUrls = [];

  for (const file of files) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPG, PNG, JPEG, WEBP images allowed");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Each image must be less than 5MB");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "rent_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/diy0ylddd/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!data.secure_url) {
      throw new Error("Image upload failed");
    }

    uploadedUrls.push(data.secure_url);
  }

  return uploadedUrls;
};
