import Sidebar from "./Sidebar";
import "./LayoutBase.css";

export default function LayoutBase({ children, title }) {
  return (
    <div className="layout-base">
      <Sidebar />
      
      <div className="layout-content">
        {title && (
          <header className="layout-header">
            <h1>{title}</h1>
          </header>
        )}
        
        <main className="layout-main">
          {children}
        </main>
      </div>
    </div>
  );
}
