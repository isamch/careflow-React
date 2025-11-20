import { Link } from 'react-router-dom';
const Unauthorized = () => (
  <div className="p-10 text-center">
    <h1 className="text-3xl font-bold text-red-500">403 - Unauthorized</h1>
    <p className="mt-4">You do not have permission to view this page.</p>
    <Link to="/dashboard" className="text-blue-500 underline mt-4 block">Go to Home</Link>
  </div>
);
export default Unauthorized;