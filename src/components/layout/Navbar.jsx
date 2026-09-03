import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu, X } from "lucide-react";

import { signOut } from "../../services/auth";

function Navbar({ onMenuClick, sidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = location.pathname.split("/").pop();

  const title =
    currentPage.charAt(0).toUpperCase() +
    currentPage.slice(1);

  const handleLogout = async () => {
    const { error } = await signOut();

    if (error) {
      console.error("Logout error:", error);
      return;
    }

    navigate("/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <h2 className="text-xl font-semibold sm:text-2xl">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button className="relative">
          <Bell size={22} />

          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            3
          </span>
        </button>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800 sm:px-4"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;