import './css/AdminSidebar.css';

const AdminSidebar = ({ tabs, activeTab, onChange }) => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-title">Admin Menu</div>
      <div className="admin-sidebar-links">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`admin-sidebar-link ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default AdminSidebar;
