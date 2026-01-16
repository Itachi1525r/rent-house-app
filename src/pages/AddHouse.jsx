import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { uploadMultipleToCloudinary } from "../services/cloudinary";

function AddHouse() {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [rent, setRent] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [locationUrl, setLocationUrl] = useState(""); // ✅ NEW
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please select at least one image");
      return;
    }

    setLoading(true);

    try {
      const imageUrls = await uploadMultipleToCloudinary(images);

      await addDoc(collection(db, "houses"), {
        ownerId: user.uid,
        title,
        rent: Number(rent),
        bedrooms: Number(bedrooms),
        area,
        address,
        locationUrl, // ✅ NEW
        contact,
        description,
        images: imageUrls,
        status: "available",
        createdAt: serverTimestamp(),
      });

      alert("House added successfully!");

      setTitle("");
      setRent("");
      setBedrooms("");
      setArea("");
      setAddress("");
      setLocationUrl(""); // ✅ reset
      setContact("");
      setDescription("");
      setImages([]);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to add house");
    }

    setLoading(false);
  };

  return (
    <div className="container page-container">
      <h2 className="mb-3">Add New House</h2>

      <form onSubmit={handleSubmit} className="card p-4">
        <input
          className="form-control mb-3"
          placeholder="House Title (e.g. 2 BHK Flat)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="number"
          className="form-control mb-3"
          placeholder="Monthly Rent (₹)"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          required
        />

        <input
          type="number"
          className="form-control mb-3"
          placeholder="Number of Bedrooms"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          required
        />

        <input
          className="form-control mb-3"
          placeholder="Area (e.g. Adajan)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          required
        />

        <input
          className="form-control mb-3"
          placeholder="Full Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        {/* 🔹 GOOGLE MAPS LINK (NEW, UI-SAFE) */}
        <input
          className="form-control mb-3"
          placeholder="Google Maps Location Link (optional)"
          value={locationUrl}
          onChange={(e) => setLocationUrl(e.target.value)}
        />

        <input
          type="tel"
          className="form-control mb-3"
          placeholder="Owner Contact Number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />

        <textarea
          className="form-control mb-3"
          placeholder="House Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          className="form-control mb-3"
          multiple
          accept="image/*"
          onChange={(e) => setImages([...e.target.files])}
          required
        />

        {/* IMAGE PREVIEW */}
        {images.length > 0 && (
          <div className="row mb-3">
            {images.map((img, index) => (
              <div key={index} className="col-md-3 mb-2">
                <img
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="img-fluid rounded"
                  style={{ height: "120px", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        )}

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Uploading..." : "Add House"}
        </button>
      </form>
    </div>
  );
}

export default AddHouse;
