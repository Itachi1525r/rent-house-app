import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🔹 Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = userCredential.user.uid;

      // 🔹 Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", uid));

      if (userDoc.exists()) {
        const role = userDoc.data().role?.toString().trim().toLowerCase();

        // 🔹 Role-based redirect
        if (role === "owner") {
          navigate("/owner", { replace: true });
        } else {
          navigate("/search", { replace: true });
        }
      } else {
        navigate("/search", { replace: true });
      }
    } catch (err) {
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="container page-container">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card p-4 shadow-sm">
            <h3 className="text-center mb-3">Login</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* 🔹 Forgot password */}
              <div className="text-center mt-3">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              {/* 🔹 Register link */}
              <div className="text-center mt-2">
                <span className="text-muted">Don’t have an account? </span>
                <Link to="/register">Register here</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
