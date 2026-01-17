// src/services/cloudinary.js

/* ===============================
   🔹 CLOUDINARY CONFIG
================================ */
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/diy0ylddd/image/upload";

const UPLOAD_PRESET = "rent_upload";

/* ===============================
   🔹 IMAGE VALIDATION (SHARED)
================================ */
const validateImage = (file) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only JPG, PNG, JPEG, WEBP images allowed");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be less than 5MB");
  }
};

/* ===============================
   🔹 MULTIPLE IMAGE UPLOAD
   🔹 (FOR HOUSES)
================================ */
export const uploadMultipleToCloudinary = async (files) => {
  const uploadedUrls = [];

  for (const file of files) {
    validateImage(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data.secure_url) {
      throw new Error("House image upload failed");
    }

    uploadedUrls.push(data.secure_url);
  }

  return uploadedUrls;
};

/* ===============================
   🔹 SINGLE IMAGE UPLOAD
   🔹 (OWNER FACE PHOTO)
================================ */
export const uploadOwnerFaceToCloudinary = async (file) => {
  validateImage(file);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!data.secure_url) {
    throw new Error("Owner face image upload failed");
  }

  return data.secure_url;
};
