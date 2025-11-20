import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicService } from '../../services/publicService';
import { appointmentService } from '../../services/appointmentService';
import { Calendar, Clock, User, Stethoscope, CheckCircle, AlertCircle } from 'lucide-react';

const NewAppointment = () => {
  const navigate = useNavigate();

  // --- State Management ---
  const [step, setStep] = useState(1); // 1: Doctor, 2: Date/Slot, 3: Reason/Confirm
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Data States
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Selection States
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null); // { start, end }
  const [reason, setReason] = useState('');

  // --- Effects ---
  
  // Load doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await publicService.getAllDoctors();
        setDoctors(response.data || []);
      } catch (err) {
        setError("Failed to load doctors list.");
        console.log(err);
        
      }
    };
    fetchDoctors();
  }, []);

  // Fetch slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const fetchSlots = async () => {
        setLoading(true);
        setAvailableSlots([]); // Reset slots
        try {
          const response = await appointmentService.getAvailableSlots(selectedDoctor.id, selectedDate);
          // Postman response structure: { data: { availableSlots: [...] } }
          // Check implementation based on your backend response
          const slots = response.data?.availableSlots || []; 
          setAvailableSlots(slots);
        } catch (err) {
          console.error(err);
          // Don't block UI, just show no slots
        } finally {
          setLoading(false);
        }
      };
      fetchSlots();
    }
  }, [selectedDoctor, selectedDate]);

  // --- Handlers ---

  const handleSubmit = async () => {
    if (!selectedSlot || !selectedDoctor) return;
    
    setLoading(true);
    setError('');
    
    try {
      await appointmentService.createAppointment({
        doctorId: selectedDoctor.id,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        reason: reason
      });
      
      // Success! Redirect to appointments list
      navigate('/my-appointments');
    } catch (err) {
      setError(err.message || "Failed to book appointment");
      setLoading(false);
    }
  };

  // --- Render Helpers ---

  // Step 1: Select Doctor
  const renderDoctorSelection = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {doctors.map((doc) => (
        <div 
          key={doc.id}
          onClick={() => { setSelectedDoctor(doc); setStep(2); }}
          className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center gap-4 ${
            selectedDoctor?.id === doc.id 
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
              : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
          }`}
        >
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <Stethoscope size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{doc.fullName}</h3>
            <p className="text-sm text-gray-500">{doc.specialization || 'General Practitioner'}</p>
          </div>
        </div>
      ))}
    </div>
  );

  // Step 2: Select Date & Time
  const renderSlotSelection = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
        <input 
          type="date" 
          min={new Date().toISOString().split('T')[0]} // Disable past dates
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {selectedDate && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Available Slots</h4>
          {loading ? (
             <div className="text-center py-4 text-gray-500">Checking availability...</div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {availableSlots.map((slot, index) => {
                 // Simple formatting for display
                 const startTime = new Date(slot.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                 const isSelected = selectedSlot === slot;
                 
                 return (
                   <button
                     key={index}
                     onClick={() => setSelectedSlot(slot)}
                     className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                       isSelected 
                         ? 'bg-blue-600 text-white shadow-md' 
                         : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                     }`}
                   >
                     {startTime}
                   </button>
                 );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
               <AlertCircle className="mx-auto h-8 w-8 mb-2 text-gray-400" />
               No slots available for this date. Try another day.
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button onClick={() => setStep(1)} className="text-gray-600 hover:text-gray-900 font-medium">Back</button>
        <button 
          disabled={!selectedSlot}
          onClick={() => setStep(3)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  );

  // Step 3: Reason & Confirm
  const renderConfirmation = () => (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Confirm Appointment</h3>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3">
          <User className="text-gray-400 mt-1" size={18} />
          <div>
            <span className="block text-xs text-gray-500 uppercase">Doctor</span>
            <span className="font-medium text-gray-900">{selectedDoctor?.fullName}</span>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
           <Calendar className="text-gray-400 mt-1" size={18} />
           <div>
             <span className="block text-xs text-gray-500 uppercase">Date & Time</span>
             <span className="font-medium text-gray-900">
               {new Date(selectedDate).toLocaleDateString()} at {new Date(selectedSlot?.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
             </span>
           </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit (Optional)</label>
          <textarea 
            rows="3"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Annual checkup, Headache..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={() => setStep(2)} 
          className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
        >
          Back
        </button>
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 flex justify-center items-center gap-2"
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Book New Appointment</h2>
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10"></div>
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
              step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {s}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
          <span>Select Doctor</span>
          <span>Date & Time</span>
          <span>Confirm</span>
        </div>
      </div>

      {/* Content */}
      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">{error}</div>}
      
      {step === 1 && renderDoctorSelection()}
      {step === 2 && renderSlotSelection()}
      {step === 3 && renderConfirmation()}
    </div>
  );
};

export default NewAppointment;