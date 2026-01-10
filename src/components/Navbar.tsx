import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="nav-left">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/watchlist" className="nav-link">
            Watchlist
          </Link>
        </div>

        <div className="nav-right">
          {user ? (
            <>
              <div className="auth-chip">{user.email}</div>
              <button className="control-btn" onClick={signOut}>
                Sign out
              </button>
            </>
          ) : (
            <Link to="/auth" className="nav-link active">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
