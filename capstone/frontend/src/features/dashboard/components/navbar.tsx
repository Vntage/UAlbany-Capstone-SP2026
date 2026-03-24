import { useState, useEffect } from "react";
import DashboardIcon from "../../../assets/navbar/dashboard.png";
import UsersIcon from "../../../assets/navbar/users.png";
import ReportIcon from "../../../assets/navbar/report.png";
import BudgetIcon from "../../../assets/navbar/budget.png";
import SettingsIcon from "../../../assets/navbar/setting.png";
import SupportIcon from "../../../assets/navbar/support.png";
import LogoutIcon from "../../../assets/navbar/logout.png";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../../config/firebase";

export default function Navbar() {
  // Load initial state from localStorage
  const [isHovered, setIsHovered] = useState(() => {
    const saved = localStorage.getItem("navbarOpen");
    return saved === "true" ? true : false;
  });

  const navWidth = isHovered ? "w-64" : "w-16";
  const navigate = useNavigate();

  useEffect(() => {
    // Save navbar state
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

  const renderLink = (link: typeof mainLinks[0]) => (
    <Link
      key={link.name}
      to={link.path}
      className="flex items-center gap-3 px-4 py-2 hover:bg-sky-600 rounded transition-colors"
    >
      <img src={link.icon} alt={link.name} className="w-6 h-6" />
      {isHovered && <span>{link.name}</span>}
    </Link>
  );

  return (
    <aside
      className={`bg-sky-700 text-white transition-all duration-300 ${navWidth} flex flex-col justify-between`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center h-16 border-b border-sky-600 font-bold text-lg">
        {isHovered ? "Financial App" : "FA"}
      </div>

      <nav className="flex-1 mt-4">
        <ul className="flex flex-col gap-2">{mainLinks.map(renderLink)}</ul>
      </nav>

      <nav className="mb-4">
        <ul className="flex flex-col gap-2">
          {bottomLinks.map(renderLink)}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 hover:bg-red-600 rounded w-full transition-colors"
            >
              <img src={LogoutIcon} alt="Logout" className="w-6 h-6" />
              {isHovered && <span>Logout</span>}
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}