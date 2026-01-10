import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthBar() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signUp = async () => {
    if (!email || !password || loading) return;
    setLoading(true);
    setStatus("");

    const { error } = await supabase.auth.signUp({ email, password });

    setStatus(
      error
        ? error.message
        : "Registered! You can now log in (or check email if confirmation is enabled)."
    );
    setLoading(false);
  };

  const signIn = async () => {
    if (!email || !password || loading) return;
    setLoading(true);
    setStatus("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setStatus(error ? error.message : "");
    setLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setStatus("");
  };

  if (user) {
    return (
      <div className="auth-inline">
        <div className="auth-chip">{user.email}</div>
        <button className="control-btn" onClick={signOut}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="auth-inline">
      <input
        className="control-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <input
        className="control-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      <button className="control-btn" onClick={signIn} disabled={loading}>
        {loading ? "..." : "Login"}
      </button>

      <button className="control-btn" onClick={signUp} disabled={loading}>
        {loading ? "..." : "Register"}
      </button>

      {status && <div className="auth-status">{status}</div>}
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";

// export default function AuthBar() {
//   const [loading, setLoading] = useState(false);
//   const [email, setEmail] = useState("");
//   const [user, setUser] = useState<any>(null);
//   const [status, setStatus] = useState("");

//   useEffect(() => {
//     supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));

//     const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
//       setUser(session?.user ?? null);
//     });

//     return () => sub.subscription.unsubscribe();
//   }, []);

//   const signIn = async () => {
//     if (!email || loading) return;

//     setLoading(true);
//     setStatus("Sending login link...");

//     const { error } = await supabase.auth.signInWithOtp({
//       email,
//       options: { emailRedirectTo: window.location.origin },
//     });

//     setStatus(error ? error.message : "Check your email for the login link.");
//     setLoading(false);
//   };

//   const signOut = async () => {
//     await supabase.auth.signOut();
//     setStatus("");
//   };

//   return (
//     <div className="auth-inline">
//       {user ? (
//         <>
//           <div className="auth-chip">{user.email}</div>
//           <button className="control-btn" onClick={signOut}>
//             Sign out
//           </button>
//         </>
//       ) : (
//         <>
//           <input
//             className="control-input"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Enter email to sign in"
//           />
//           <button className="control-btn" onClick={signIn} disabled={loading}>
//             {loading ? (
//               <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                 <span className="btn-spinner" />
//                 Sending…
//               </span>
//             ) : (
//               "Send login link"
//             )}
//           </button>
//         </>
//       )}
//     </div>
//   );
// }
