import "./SidebarToggle.css";

interface SidebarToggleProps {
  toggleSidebar: () => void;
}

const SidebarToggle = ({ toggleSidebar }: SidebarToggleProps) => {
  return (
    <button
      className="sidebar-toggle"
      onClick={toggleSidebar}
      aria-label="Toggle Menu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
};

export default SidebarToggle;
