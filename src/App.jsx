import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      {/* We will add the Navbar/Sidebar here in the next step.
          For now, we just render the routes.
      */}
      <AppRoutes />
    </div>
  );
}

export default App;