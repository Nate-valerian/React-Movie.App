import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [kind, setKind] = useState<"info" | "error" | "success">("info");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate("/");
    });
  }, [navigate]);

  const login = async () => {
    if (!email || !password || loading) return;
    setLoading(true);
    setMessage("");
    setKind("info");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Common case with confirmations enabled
      if (error.message.toLowerCase().includes("invalid login credentials")) {
        setKind("error");
        setMessage(
          "Login failed. If you just registered, please confirm your email first (check your inbox)."
        );
      } else {
        setKind("error");
        setMessage(error.message);
      }
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/");
  };

  const register = async () => {
    if (!email || !password || loading) return;
    setLoading(true);
    setMessage("");
    setKind("info");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) {
      setKind("error");
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setKind("success");
    setMessage(
      "Account created! Please check your email and click the confirmation link before logging in."
    );
    setLoading(false);
    setMode("login");
  };

  const resendConfirmation = async () => {
    if (!email || loading) return;
    setLoading(true);
    setMessage("");
    setKind("info");

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) {
      setKind("error");
      setMessage(error.message);
    } else {
      setKind("success");
      setMessage(
        "Confirmation email sent again. Please check your inbox/spam."
      );
    }

    setLoading(false);
  };

  const forgotPassword = async () => {
    if (!email || loading) return;
    setLoading(true);
    setMessage("");
    setKind("info");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });

    if (error) {
      setKind("error");
      setMessage(error.message);
    } else {
      setKind("success");
      setMessage("Password reset email sent. Check your inbox/spam.");
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">
          {mode === "login" ? "Sign in" : "Create account"}
        </h1>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={`auth-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => setMode("register")}
            type="button"
          >
            Register
          </button>
        </div>

        <div className="auth-form">
          <input
            className="control-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="control-input"
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {mode === "login" ? (
            <>
              <button
                className="control-btn"
                onClick={login}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="auth-actions">
                <button
                  className="auth-link"
                  type="button"
                  onClick={resendConfirmation}
                  disabled={loading}
                >
                  Resend confirmation email
                </button>

                <button
                  className="auth-link"
                  type="button"
                  onClick={forgotPassword}
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>
            </>
          ) : (
            <button
              className="control-btn"
              onClick={register}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          )}

          {message && <p className={`auth-message ${kind}`}>{message}</p>}

          <button
            className="auth-back"
            onClick={() => navigate("/")}
            type="button"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
