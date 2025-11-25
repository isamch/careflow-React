import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  // Format pathname to a readable title (e.g., "/my-appointments" -> "My Appointments")
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1] || 'Dashboard';
    return path.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-primary-900 tracking-tight">
        {getPageTitle()}
      </h1>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar (Visual Only for now) */}
        <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-300 transition-all duration-200 w-64">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none focus:outline-none text-sm ml-2 w-full text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 text-gray-500 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all duration-200">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
