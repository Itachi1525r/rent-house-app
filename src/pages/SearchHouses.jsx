import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import FilterBar from "../components/FilterBar";
import { Link } from "react-router-dom";

function SearchHouses() {
  const [filters, setFilters] = useState({
    minRent: "",
    maxRent: "",
    bedrooms: "",
    area: "",
  });

  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // 🔹 NEW

  // 🔹 Load all houses initially (optional preview)
  useEffect(() => {
    const fetchAllHouses = async () => {
      const snapshot = await getDocs(collection(db, "houses"));
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHouses(results);
    };
    fetchAllHouses();
  }, []);

  // 🔹 Search houses
  const searchHouses = async () => {
    setLoading(true);
    setSearched(true);
    setHouses([]);

    try {
      const housesRef = collection(db, "houses");
      let conditions = [];

      if (filters.area) conditions.push(where("area", "==", filters.area));
      if (filters.bedrooms)
        conditions.push(where("bedrooms", "==", Number(filters.bedrooms)));
      if (filters.minRent)
        conditions.push(where("rent", ">=", Number(filters.minRent)));
      if (filters.maxRent)
        conditions.push(where("rent", "<=", Number(filters.maxRent)));

      const q =
        conditions.length > 0 ? query(housesRef, ...conditions) : housesRef;

      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHouses(results);
    } catch (error) {
      alert("Search failed");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="container page-container">
      <h2>Search Rental Houses</h2>

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        onSearch={searchHouses}
      />

      {/* LOADING */}
      {loading && <p className="text-center mt-4">Searching houses...</p>}

      {/* NO RESULT AFTER SEARCH */}
      {!loading && searched && houses.length === 0 && (
        <p className="text-center mt-4 text-muted">
          ❌ No houses found for the selected filters.
        </p>
      )}

      {/* RESULTS */}
      <div className="row mt-4">
        {houses.map((house) => {
          const card = (
            <div className="card h-100">
              {house.images?.length > 0 && (
                <img
                  src={house.images[0]}
                  alt="House"
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                />
              )}

              <div className="card-body">
                <span
                  className={`badge mb-2 ${
                    house.status === "available" ? "bg-success" : "bg-danger"
                  }`}
                >
                  {house.status}
                </span>

                <h5>{house.area}, Surat</h5>
                <p>₹{house.rent}</p>
                <p>{house.bedrooms} BHK</p>
              </div>
            </div>
          );

          return (
            <div key={house.id} className="col-md-4 mb-3">
              {house.status === "available" ? (
                <Link
                  to={`/house/${house.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
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
    </div>
  );
}

export default SearchHouses;
