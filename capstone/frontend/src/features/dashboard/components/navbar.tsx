import { useState, useEffect, useRef } from "react";
import DashboardIcon from "../../../assets/navbar/dashboard.png";
import UsersIcon from "../../../assets/navbar/users.png";
import ReportIcon from "../../../assets/navbar/report.png";
import BudgetIcon from "../../../assets/navbar/budget.png";
import SettingsIcon from "../../../assets/navbar/setting.png";
import SupportIcon from "../../../assets/navbar/support.png";
import LogoutIcon from "../../../assets/navbar/logout.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../../config/firebase";

export default function Navbar() {
  const [isHovered, setIsHovered] = useState(() => {
    return localStorage.getItem("navbarOpen") === "true";
  });

  const navigate = useNavigate();
  const location = useLocation();
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setIsHovered(false);
    }, 180);
  };

  const navWidth = isHovered ? "w-64" : "w-20";

  useEffect(() => {
    localStorage.setItem("navbarOpen", isHovered.toString());
  }, [isHovered]);

  const mainLinks = [
    { name: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
    { name: "Users", icon: UsersIcon, path: "/users" },
    { name: "Reports", icon: ReportIcon, path: "/reports" },
    { name: "Budget", icon: BudgetIcon, path: "/budget" },
  ];

  const bottomLinks = [
    { name: "Settings", icon: SettingsIcon, path: "/settings" },
    { name: "Support", icon: SupportIcon, path: "/support" },
  ];

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  const renderLink = (link: typeof mainLinks[0]) => {
    const isActive = location.pathname === link.path;

    return (
      <Link
        key={link.name}
        to={link.path}
        className={`flex items-center px-4 py-3 rounded-lg
        transition-colors duration-200
        ${isActive ? "bg-white/10" : "hover:bg-white/10"}`}
      >
        <img
          src={link.icon}
          alt={link.name}
          className={`w-6 h-6 filter brightness-0 invert flex-shrink-0 transition-all duration-300 ${ isHovered ? "ml-3" : "ml-3" }`}
        />

        {/* Only fade text, don't move layout */}
        <span
          className={`ml-3 font-medium whitespace-nowrap transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {link.name}
        </span>
      </Link>
    );
  };

  return (
    <aside
      className={`bg-gradient-to-b from-[#1e3a8a] via-[#4c1d95] to-[#1e1b4b]
      text-white ${navWidth}
      transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
      flex flex-col justify-between shadow-xl overflow-hidden`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center px-4 h-16 border-b border-white/10 font-bold text-lg relative">
  
  {/* Full Title */}
  <span
    className={`absolute left-4 transition-opacity duration-200 whitespace-nowrap ${ isHovered ? "ml-10 opacity-100" : "ml-10 opacity-0" }`}
  >
    Financial Monitor
  </span>

  {/* Collapsed Title */}
  <span
    className={`mx-auto transition-opacity duration-200 ${ isHovered ? "opacity-0" : "opacity-100" }`}
  >
    $$
  </span>

</div>

      {/* Top Links */}
      <nav className="flex-1 mt-6">
        <ul className="flex flex-col gap-2">
          {mainLinks.map(renderLink)}
        </ul>
      </nav>

      {/* Bottom Links */}
      <nav className="mb-6">
        <ul className="flex flex-col gap-2">
          {bottomLinks.map(renderLink)}

          <li>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-3 rounded-lg w-full
              hover:bg-red-500/80 transition-colors duration-200"
            >
              <img
                src={LogoutIcon}
                alt="Logout"
                className={`w-6 h-6 filter brightness-0 invert flex-shrink-0 transition-all duration-300 ${ isHovered ? "ml-3" : "ml-3" }`}
              />
              <span
                className={`ml-3 font-medium transition-opacity duration-200 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                Logout
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}