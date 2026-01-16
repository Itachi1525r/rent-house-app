import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function OwnerDashboard() {
  const { user } = useAuth();

  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // 🔹 Fetch owner's houses (ESLint-safe)
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const q = query(
          collection(db, "houses"),
          where("ownerId", "==", user.uid)
        );

        const snapshot = await getDocs(q);
        const houseList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHouses(houseList);
      } catch (error) {
        console.error("Error fetching houses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchHouses();
    }
  }, [user.uid]);

  // 🔹 Delete house
  const handleDelete = async (houseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this house?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(houseId);
      await deleteDoc(doc(db, "houses", houseId));

      // remove from UI immediately
      setHouses((prev) => prev.filter((h) => h.id !== houseId));
    } catch (error) {
      alert("Failed to delete house");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container page-container">
      <h2 className="mb-2">Owner Dashboard</h2>

      <p className="text-muted">
        Welcome <strong>{user.email}</strong>
      </p>

      <Link to="/owner/add-house" className="btn btn-primary mb-4">
        + Add New House
      </Link>

      <hr />

      <h4>Your Listed Houses</h4>

      {loading && <p>Loading houses...</p>}

      {!loading && houses.length === 0 && (
        <p className="text-muted">You have not added any houses yet.</p>
      )}

      <div className="row">
        {houses.map((house) => (
          <div key={house.id} className="col-md-4 mb-3">
            <div className="card h-100">
              {/* 🔹 CLICKABLE CARD */}
              <Link
                to={`/house/${house.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {house.images?.length > 0 && (
                  <img
                    src={house.images[0]}
                    alt="House"
                    className="card-img-top"
                    style={{
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />
                )}

                <div className="card-body">
                  <h5 className="card-title">{house.title}</h5>
                  <p className="mb-1">
                    <strong>₹{house.rent}</strong>
                  </p>
                  <p className="text-muted small">
                    {house.bedrooms} BHK • {house.area}
                  </p>
                </div>
              </Link>

              {/* 🔹 ACTION BUTTONS */}
              <div className="card-footer d-flex justify-content-between">
                <Link
                  to={`/house/${house.id}/edit`}
                  className="btn btn-sm btn-outline-secondary"
                >
                  Edit
                </Link>

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(house.id)}
                  disabled={deletingId === house.id}
                >
                  {deletingId === house.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OwnerDashboard;
