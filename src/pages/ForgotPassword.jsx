import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Password reset email sent successfully. Please check your inbox (and spam folder)."
      );
    } catch (err) {
      console.error("Reset error:", err.code);

      if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Failed to send reset email. Try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="container page-container">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card p-4">
            <h3 className="text-center mb-3">Forgot Password</h3>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleReset}>
              <div className="mb-3">
                <label className="form-label">Registered Email</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
