import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { uploadOwnerFaceToCloudinary } from "../services/cloudinary";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [faceImage, setFaceImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    // 🔒 Owner must upload face photo
    if (role === "owner" && !faceImage) {
      alert("Owner face photo is required");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create Auth user
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      let faceUrl = "";

      // 2️⃣ Upload owner face image (only for owner)
      if (role === "owner") {
        faceUrl = await uploadOwnerFaceToCloudinary(faceImage);
      }

      // 3️⃣ Save user profile in Firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        name,
        email,
        role,
        faceUrl, // 🔥 IMPORTANT
        createdAt: serverTimestamp(),
      });

      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-container">
      <h2 className="mb-3">Register</h2>

      <form onSubmit={handleRegister} className="card p-4">
        <input
          className="form-control mb-3"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="form-control mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="owner">Owner</option>
        </select>

        {/* 👤 OWNER FACE UPLOAD */}
        {role === "owner" && (
          <input
            type="file"
            className="form-control mb-3"
            accept="image/*"
            onChange={(e) => setFaceImage(e.target.files[0])}
            required
          />
        )}

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;
