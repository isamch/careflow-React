import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { Search, User, Calendar, ArrowRight, Activity } from 'lucide-react';

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatientsFromAppointments = async () => {
      try {
        // 1. Get all appointments for the doctor
        const res = await doctorService.getMyAppointments();
        const appointments = res.data || [];

        // 2. Extract unique patients
        const uniquePatientsMap = new Map();

        appointments.forEach(appt => {
          if (appt.patient && !uniquePatientsMap.has(appt.patientId)) {
            uniquePatientsMap.set(appt.patientId, {
              id: appt.patientId,
              fullName: appt.patient.fullName,
              email: appt.patient.email,
              lastVisit: appt.startTime, // Capture the latest visit date logic can be improved
              totalVisits: 1
            });
          } else if (appt.patient && uniquePatientsMap.has(appt.patientId)) {
            // Update stats for existing patient in map
            const p = uniquePatientsMap.get(appt.patientId);
            p.totalVisits += 1;
            if (new Date(appt.startTime) > new Date(p.lastVisit)) {
              p.lastVisit = appt.startTime;
            }
          }
        });

        const patientsArray = Array.from(uniquePatientsMap.values());
        setPatients(patientsArray);
        setFilteredPatients(patientsArray);

      } catch (err) {
        console.error("Failed to load patients", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientsFromAppointments();
  }, []);

  // Handle Search
  useEffect(() => {
    const results = patients.filter(p =>
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(results);
  }, [searchTerm, patients]);

  if (loading) return <div className="p-8 text-center">Loading patients list...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <User className="text-blue-600" /> My Patients
          </h2>
          <p className="text-gray-500 text-sm">List of patients you have consulted with.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Patients Grid */}
      {filteredPatients.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <User className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500">No patients found matching your search.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all hover:border-blue-200 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                    {patient.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{patient.fullName}</h3>
                    <p className="text-xs text-gray-500">{patient.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Activity size={14} /> Total Visits
                  </span>
                  <span className="font-medium bg-gray-100 px-2 py-0.5 rounded">{patient.totalVisits}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Calendar size={14} /> Last Visit
                  </span>
                  <span className="font-medium">
                     {new Date(patient.lastVisit).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <Link 
                to={`/patients/${patient.id}`}
                className="block w-full py-2 text-center border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                View Medical Record <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientsList;