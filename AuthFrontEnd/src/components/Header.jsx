import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
    });

    if (result.isConfirmed) {
      logout();
      navigate("/login");
      Swal.fire({
        icon: "success",
        title: "Logged Out",
        showConfirmButton: false,
        timer: 1200,
      });
    }
  };

  const navButton = (path, label) => {
    const isActive = location.pathname === path;

    return (
      <button
        onClick={() => navigate(path)}
        className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200
          ${
            isActive
              ? "bg-white text-blue-800 shadow"
              : "bg-blue-700 text-white hover:bg-blue-600"
          }`}
      >
        {label}
      </button>
    );
  };

  return (
    <header className="bg-blue-800 px-6 py-4 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div
          className="text-white font-bold text-2xl cursor-pointer"
          onClick={() => navigate("/home")}
        >
          Assignment
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3 flex-wrap">
          {navButton("/home", "Home")}
          {navButton("/profile", "Profile")}
          {navButton("/logs", "CRM Logs")}
          {navButton("/login-history", "Auth Login History")}
          {navButton("/failed-webhooks", "Failed Webhooks")}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-white text-blue-800 px-4 py-2 rounded-md text-sm font-semibold
                     hover:bg-gray-100 transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
