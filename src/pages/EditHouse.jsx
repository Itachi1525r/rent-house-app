import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

function EditHouse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    rent: "",
    bedrooms: "",
    area: "",
    address: "",
    description: "",
    contact: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchHouse = async () => {
      const snap = await getDoc(doc(db, "houses", id));
      if (!snap.exists()) return navigate("/");

      const data = snap.data();

      // 🔐 owner check
      if (data.ownerId !== user.uid) {
        return navigate("/");
      }

      setForm({
        title: data.title,
        rent: data.rent,
        bedrooms: data.bedrooms,
        area: data.area,
        address: data.address,
        description: data.description,
        contact: data.contact,
      });

      setLoading(false);
    };

    fetchHouse();
  }, [id, user.uid, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateDoc(doc(db, "houses", id), {
        title: form.title,
        rent: Number(form.rent),
        bedrooms: Number(form.bedrooms),
        area: form.area,
        address: form.address,
        description: form.description,
        contact: form.contact,
      });

      alert("House updated successfully");
      navigate(`/house/${id}`);
    } catch (error) {
      alert("Failed to update house");
      console.error(error);
    }

    setSaving(false);
  };

  if (loading) return <p className="container">Loading...</p>;

  return (
    <div className="container page-container">
      <h2 className="mb-3">Edit House</h2>

      <form onSubmit={handleSubmit} className="card p-4">
        <input
          name="title"
          className="form-control mb-3"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />

        <input
          name="rent"
          type="number"
          className="form-control mb-3"
          value={form.rent}
          onChange={handleChange}
          placeholder="Rent"
          required
        />

        <input
          name="bedrooms"
          type="number"
          className="form-control mb-3"
          value={form.bedrooms}
          onChange={handleChange}
          placeholder="Bedrooms"
          required
        />

        <input
          name="area"
          className="form-control mb-3"
          value={form.area}
          onChange={handleChange}
          placeholder="Area"
          required
        />

        <input
          name="address"
          className="form-control mb-3"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          required
        />

        <textarea
          name="description"
          className="form-control mb-3"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <input
          name="contact"
          className="form-control mb-3"
          value={form.contact}
          onChange={handleChange}
          placeholder="Contact Number"
          required
        />

        <button className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Update House"}
        </button>
      </form>
    </div>
  );
}

export default EditHouse;
