import { Link, useLocation } from "react-router-dom";
import { FaCalendarAlt, FaChartBar, FaUsers, FaMoneyBillWave } from "react-icons/fa";
import "./BottomNav.css";

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/calendario", icon: FaCalendarAlt, label: "Calendario" },
    { path: "/reportes", icon: FaChartBar, label: "Reportes" },
    { path: "/cliente", icon: FaUsers, label: "Clientes" },
    { path: "/ventas", icon: FaMoneyBillWave, label: "Ventas" }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item ${isActive ? "active" : ""}`}
          >
            <Icon size={22} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
