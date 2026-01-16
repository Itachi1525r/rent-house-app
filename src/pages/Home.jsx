import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../services/firebase";

function Home() {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch user role
  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setRole(snap.data().role);
        }
      }
    };
    fetchRole();
  }, [user]);

  // 🔹 Fetch houses (owner: own houses | user: featured houses)
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        let q;

        if (user && role === "owner") {
          q = query(collection(db, "houses"), where("ownerId", "==", user.uid));
        } else {
          q = collection(db, "houses");
        }

        const snapshot = await getDocs(q);
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHouses(results);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchHouses();
  }, [user, role]);

  // ===============================
  // 🔹 OWNER HOME (DASHBOARD)
  // ===============================
  if (user && role === "owner") {
    const total = houses.length;
    const available = houses.filter((h) => h.status === "available").length;
    const rented = houses.filter((h) => h.status === "rented").length;

    return (
      <div className="container py-5">
        {/* WELCOME */}
        <div className="mb-4">
          <h2 className="fw-bold">Welcome back 👋</h2>
          <p className="text-muted">
            Manage your rental properties easily from here.
          </p>
        </div>

        {/* STATS */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm stat-card">
              <div className="card-body">
                <h5>Total Houses</h5>
                <h2 className="fw-bold">{total}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm border-success stat-card">
              <div className="card-body">
                <h5>Available</h5>
                <h2 className="fw-bold text-success">{available}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm border-danger stat-card">
              <div className="card-body">
                <h5>Rented</h5>
                <h2 className="fw-bold text-danger">{rented}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5>➕ Add New House</h5>
                <p className="text-muted">List a new property for rent.</p>
                <Link to="/owner/add-house" className="btn btn-primary">
                  Add House
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5>📋 Manage Listings</h5>
                <p className="text-muted">
                  Edit, delete or update your houses.
                </p>
                <Link to="/owner" className="btn btn-outline-secondary">
                  View Dashboard
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5>👤 Profile</h5>
                <p className="text-muted">
                  View and update your profile details.
                </p>
                <Link to="/profile" className="btn btn-outline-dark">
                  Go to Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {!loading && total === 0 && (
          <div className="text-center mt-5 text-muted">
            <p>You haven’t added any houses yet.</p>
            <Link to="/owner/add-house" className="btn btn-primary">
              Add Your First House
            </Link>
          </div>
        )}
      </div>
    );
  }

  // ===============================
  // 🔹 USER HOME (FULL & POLISHED)
  // ===============================
  return (
    <div>
      {/* HERO */}
      <section className="py-5 bg-light text-center">
        <div className="container">
          <h1 className="fw-bold mb-3">Find Your Perfect Rental Home</h1>
          <p className="text-muted mb-4">
            Search houses by area, rent and bedrooms.
          </p>

          <Link to="/search" className="btn btn-primary btn-lg">
            Search Houses
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="mb-4">How It Works</h2>

          <div className="row">
            <div className="col-md-4 mb-3">
              <h5>🔍 Search</h5>
              <p className="text-muted">
                Find houses by area, budget and bedrooms.
              </p>
            </div>

            <div className="col-md-4 mb-3">
              <h5>🏠 Choose</h5>
              <p className="text-muted">View house images and details.</p>
            </div>

            <div className="col-md-4 mb-3">
              <h5>📞 Contact</h5>
              <p className="text-muted">Contact owners directly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED HOUSES */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Featured Houses</h2>

          {loading && <p className="text-center">Loading houses...</p>}

          {!loading && houses.length === 0 && (
            <p className="text-center text-muted">
              No houses available right now.
            </p>
          )}

          <div className="row">
            {houses.slice(0, 4).map((house) => {
              const card = (
                <div className="card h-100">
                  {house.images?.length > 0 && (
                    <img
                      src={house.images[0]}
                      alt="House"
                      className="card-img-top"
                      style={{
                        height: "160px",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <div className="card-body">
                    <span
                      className={`badge mb-2 ${
                        house.status === "available"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {house.status}
                    </span>

                    <h6>{house.area}, Surat</h6>
                    <p className="mb-1">₹{house.rent}</p>
                    <p className="text-muted small">{house.bedrooms} BHK</p>
                  </div>
                </div>
              );

              return (
                <div key={house.id} className="col-md-3 mb-4">
                  {house.status === "available" ? (
                    <Link
                      to={`/house/${house.id}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      {card}
                    </Link>
                  ) : (
                    <div className="opacity-50">{card}</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-3">
            <Link to="/search" className="btn btn-outline-primary">
              View All Houses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
