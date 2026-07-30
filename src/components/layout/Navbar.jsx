import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";

function Navbar() {
  const location = useLocation();

  const title =
    location.pathname.split("/").pop().charAt(0).toUpperCase() +
    location.pathname.split("/").pop().slice(1);

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

        <button className="rounded-lg bg-slate-900 px-4 py-2 text-white">
          Profile
        </button>
      </div>
    </header>
  );
}

export default Navbar;