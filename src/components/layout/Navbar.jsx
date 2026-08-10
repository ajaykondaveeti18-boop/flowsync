import { useLocation, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

import { signOut } from "../../services/auth";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const title =
    location.pathname.split("/").pop().charAt(0).toUpperCase() +
    location.pathname.split("/").pop().slice(1);

  const handleLogout = async () => {
    const { error } = await signOut();

    if (error) {
      console.error("Logout error:", error);
      return;
    }

    navigate("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h2 className="text-2xl font-semibold">{title}</h2>

      <div className="flex items-center gap-5">
        <button className="relative">
          <Bell size={22} />

          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            3
          </span>
        </button>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;