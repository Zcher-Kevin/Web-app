import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Authentication/AuthContext";
import "./Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const { isAuthenticated, user } = useAuth();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [initialDragPos, setInitialDragPos] = useState({ x: 0, y: 0 });
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget.querySelector(".drag-handle")) {
      setIsDragging(true);
      setInitialDragPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  // Handle dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && sidebarRef.current) {
      const newX = e.clientX - initialDragPos.x;
      const newY = e.clientY - initialDragPos.y;

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Get sidebar dimensions
      const sidebarWidth = sidebarRef.current.offsetWidth;
      const sidebarHeight = sidebarRef.current.offsetHeight;

      // Calculate bounds to keep sidebar within viewport
      const maxX = viewportWidth - sidebarWidth;
      const maxY = viewportHeight - sidebarHeight;

      // Apply bounds
      const boundedX = Math.max(0, Math.min(newX, maxX));
      const boundedY = Math.max(0, Math.min(newY, maxY));

      setPosition({ x: boundedX, y: boundedY });
    }
  };

  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, initialDragPos]);

  // Reset position when sidebar is closed
  useEffect(() => {
    if (!isOpen) {
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  return (
    <div
      className={`sidebar-overlay ${isOpen ? "active" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) toggleSidebar();
      }}
    >
      <div
        ref={sidebarRef}
        className={`sidebar ${isOpen ? "open" : ""}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="sidebar-header">
          <div className="drag-handle">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <h3>Menu</h3>
          <button className="close-btn" onClick={toggleSidebar}>
            ×
          </button>
        </div>

        <div className="sidebar-content">
          {isAuthenticated && user && (
            <div className="user-info">
              <div className="avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <p className="username">{user.username}</p>
                <p className="email">{user.email}</p>
              </div>
            </div>
          )}

          <nav className="sidebar-nav">
            <Link to="/" onClick={toggleSidebar}>
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={toggleSidebar}>
                  Dashboard
                </Link>
                <Link to="/settings" onClick={toggleSidebar}>
                  Settings
                </Link>
                <Link to="/profile" onClick={toggleSidebar}>
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" onClick={toggleSidebar}>
                  Login
                </Link>
                <Link to="/signup" onClick={toggleSidebar}>
                  Sign Up
                </Link>
              </>
            )}

            <div className="divider"></div>

            <Link to="/about" onClick={toggleSidebar}>
              About
            </Link>
            <Link to="/contact" onClick={toggleSidebar}>
              Contact
            </Link>
            <Link to="/help" onClick={toggleSidebar}>
              Help
            </Link>
          </nav>
        </div>

        <div className="sidebar-footer">
          <p>© 2025 My Web App</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
