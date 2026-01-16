import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

function OwnerProfile() {
  const { user } = useAuth();
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerProfile = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setOwnerData(userSnap.data());
        }
      } catch (error) {
        console.error("Failed to fetch owner profile", error);
      }

      setLoading(false);
    };

    if (user?.uid) {
      fetchOwnerProfile();
    }
  }, [user]);

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="container page-container">
      <h2 className="mb-4">Owner Profile</h2>

      <p>
        <strong>Name:</strong> {ownerData?.name || "Not added yet"}
      </p>

      <p>
        <strong>Email:</strong> {user.email}
      </p>
    </div>
  );
}

export default OwnerProfile;
