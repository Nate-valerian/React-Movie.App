import { Link, useLocation } from "react-router-dom";
import AuthBar from "./AuthBar";

export default function Navbar() {
  const { pathname } = useLocation();

  const isActive = (path: string) =>
    pathname === path ? "nav-link active" : "nav-link";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="nav-left">
          <Link to="/" className={isActive("/")}>
            Home
          </Link>
          <Link to="/watchlist" className={isActive("/watchlist")}>
            Watchlist
          </Link>
        </div>

        <div className="nav-right">
          <AuthBar />
        </div>
      </div>
    </header>
  );
}
