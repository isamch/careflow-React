import { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';
import { Pill, Search, AlertCircle, Package, Tag, DollarSign } from 'lucide-react';
import Badge from '../../components/common/Badge';

const DoctorMedications = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    setLoading(true);
    try {
      const response = await doctorService.getMedications();
      const meds = response.data?.data || [];
      setMedications(meds);
    } catch (err) {
      console.error("Failed to load medications:", err);
      setMedications([]);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories for filter
  const categories = ['all', ...new Set(medications.map(m => m.category).filter(Boolean))];

  // Filter logic
  const filteredMedications = medications.filter(med => {
    const matchesSearch =
      med.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || med.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Pill className="text-blue-600" /> Medications Inventory
        </h2>
        <p className="text-gray-500 mt-1">View available medications and stock details</p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search medication name, code, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Medications Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredMedications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Pill className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-500 font-medium">No medications found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedications.map((med) => (
            <div key={med.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant={med.requiresPrescription ? 'warning' : 'success'} size="sm">
                    {med.requiresPrescription ? 'Rx Required' : 'OTC'}
                  </Badge>
                  <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {med.code}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">{med.name}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
                  {med.description || 'No description available.'}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Tag size={14} /> Category:
                    </span>
                    <span className="font-medium text-gray-900">{med.category || 'General'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Package size={14} /> Stock:
                    </span>
                    <span className={`font-medium ${med.stockQuantity < 20 ? 'text-red-600' : 'text-green-600'}`}>
                      {med.stockQuantity} {med.unit}s
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <DollarSign size={14} /> Price:
                    </span>
                    <span className="font-bold text-gray-900">${med.price}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  Updated: {new Date(med.updatedAt).toLocaleDateString()}
                </span>
                {med.stockQuantity < 10 && (
                  <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
                    <AlertCircle size={12} /> Low Stock
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorMedications;
