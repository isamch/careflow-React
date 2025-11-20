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
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800">
        {getPageTitle()}
      </h1>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar (Visual Only for now) */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none focus:outline-none text-sm ml-2 w-48"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;