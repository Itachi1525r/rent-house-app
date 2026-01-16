import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

function HouseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [house, setHouse] = useState(null);
  const [ownerName, setOwnerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchHouseAndOwner = async () => {
      try {
        const houseSnap = await getDoc(doc(db, "houses", id));

        if (houseSnap.exists()) {
          const houseData = houseSnap.data();
          setHouse(houseData);

          const ownerSnap = await getDoc(doc(db, "users", houseData.ownerId));

          if (ownerSnap.exists()) {
            setOwnerName(ownerSnap.data().name || "House Owner");
          } else {
            setOwnerName("House Owner");
          }
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchHouseAndOwner();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this house?"
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await deleteDoc(doc(db, "houses", id));
      alert("House deleted successfully");
      navigate("/owner");
    } catch (error) {
      alert("Failed to delete house");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  // 🔹 TOGGLE AVAILABILITY STATUS
  const toggleStatus = async () => {
    const newStatus = house.status === "available" ? "rented" : "available";

    try {
      await updateDoc(doc(db, "houses", id), {
        status: newStatus,
      });

      setHouse((prev) => ({
        ...prev,
        status: newStatus,
      }));
    } catch (error) {
      alert("Failed to update house status");
      console.error(error);
    }
  };

  if (loading) return <p className="container">Loading house...</p>;
  if (!house) return <p className="container">House not found.</p>;

  const isOwner = user && user.uid === house.ownerId;

  return (
    <div className="container page-container">
      <h2 className="mb-3">{house.title}</h2>

      {/* 🔹 IMAGE SLIDER */}
      {house.images?.length > 0 && (
        <div className="text-center mb-4">
          <img
            src={house.images[currentIndex]}
            alt="House"
            className="img-fluid rounded"
            style={{
              height: "350px",
              objectFit: "cover",
              width: "100%",
              maxWidth: "700px",
            }}
          />

          {house.images.length > 1 && (
            <div className="mt-3 d-flex justify-content-center gap-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() =>
                  setCurrentIndex(
                    currentIndex === 0
                      ? house.images.length - 1
                      : currentIndex - 1
                  )
                }
              >
                ◀ Prev
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={() =>
                  setCurrentIndex(
                    currentIndex === house.images.length - 1
                      ? 0
                      : currentIndex + 1
                  )
                }
              >
                Next ▶
              </button>
            </div>
          )}
        </div>
      )}

      {/* DETAILS */}
      <div className="card p-4">
        <p>
          <strong>Rent:</strong> ₹{house.rent}
        </p>
        <p>
          <strong>Bedrooms:</strong> {house.bedrooms}
        </p>
        <p>
          <strong>Area:</strong> {house.area}
        </p>
        <p>
          <strong>Address:</strong> {house.address}
        </p>
        <p>
          <strong>Description:</strong> {house.description}
        </p>

        <hr />

        {/* 🔹 OWNER NAME */}
        <p>
          <strong>Owner Name:</strong> {ownerName}
        </p>

        {/* 🔹 STATUS */}
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={
              house.status === "available"
                ? "text-success fw-bold"
                : "text-danger fw-bold"
            }
          >
            {house.status === "available" ? "Available" : "Rented"}
          </span>
        </p>

        {/* 🗺️ MAP LOCATION */}
        {house.locationUrl && (
          <p>
            <strong>Location:</strong>{" "}
            <a
              href={house.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline-info ms-2"
            >
              View on Map
            </a>
          </p>
        )}

        {/* 🔒 CONTACT VISIBILITY */}
        <p>
          <strong>Contact Owner:</strong>{" "}
          {user ? (
            <a href={`tel:${house.contact}`}>{house.contact}</a>
          ) : (
            <span className="text-muted">Login to view contact number</span>
          )}
        </p>

        {!user && (
          <Link to="/login" className="btn btn-sm btn-outline-primary mt-2">
            Login to Contact Owner
          </Link>
        )}

        {/* 🔴 OWNER ACTIONS */}
        {isOwner && (
          <>
            <hr />

            <button
              className="btn btn-danger me-2"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete House"}
            </button>

            <Link
              to={`/house/${id}/edit`}
              className="btn btn-outline-secondary me-2"
            >
              Edit House
            </Link>

            <button
              className="btn btn-outline-warning mt-2"
              onClick={toggleStatus}
            >
              Mark as {house.status === "available" ? "Rented" : "Available"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default HouseDetail;
