import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useToast } from "@/context/ToastContext";
import {
  CalendarDays, CreditCard, Clock, CheckCircle2, XCircle, ShoppingBag
} from "lucide-react";

export default function MyRentals() {
  const [activeTab, setActiveTab] = useState("renting");
  const [rentals, setRentals] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setIsLoading(true);
        const [rentalsRes, requestsRes] = await Promise.all([
          axiosInstance.get("/bookings/my-bookings"),
          axiosInstance.get("/bookings/my-requests")
        ]);
        
        const rentalsData = rentalsRes.data?.data || [];
        const requestsData = requestsRes.data?.data || [];
        
        setRentals(Array.isArray(rentalsData) ? rentalsData : []);
        setRequests(Array.isArray(requestsData) ? requestsData : []);
      } catch (err) {
        console.error("Failed to load rentals:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRentals();
  }, []);

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await axiosInstance.patch(`/bookings/status/${bookingId}`, { status });
      setRequests(prev => prev.map(req => 
        req._id === bookingId ? { ...req, status } : req
      ));
    } catch (err) {
      console.error("Update failed", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const renderStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-600 border-amber-200",
      approved: "bg-emerald-50 text-emerald-600 border-emerald-200",
      rejected: "bg-rose-50 text-rose-600 border-rose-200",
      returned: "bg-slate-100 text-slate-600 border-slate-300",
      ongoing: "bg-blue-50 text-blue-600 border-blue-200",
      cancelled: "bg-slate-100 text-slate-500 border-slate-200",
    };
    const labels = {
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      returned: "Returned",
      ongoing: "Ongoing",
      cancelled: "Cancelled",
    };
    if (!styles[status]) return null;
    return (
      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-start">
      <DashboardSidebar />

      <main className="flex-1 p-6 lg:p-10 max-w-[1280px] w-full animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 mb-2">My Rentals</h1>
            <p className="text-slate-500 font-medium">Manage the items you are renting or have requested.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          <button 
            className={`pb-4 px-2 font-bold transition-all border-b-2 ${activeTab === 'renting' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
            onClick={() => setActiveTab('renting')}
          >
            I am Renting
          </button>
          <button 
            className={`pb-4 px-2 font-bold transition-all border-b-2 ${activeTab === 'requests' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
            onClick={() => setActiveTab('requests')}
          >
            Requests Received
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-bold">Loading your rentals...</p>
          </div>
        )}

        {/* "I am Renting" Tab */}
        {!isLoading && activeTab === 'renting' && (
          rentals.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {rentals.filter(Boolean).map((rental, index) => (
                <div 
                  key={rental._id} 
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all animate-in slide-in-from-bottom-4 fade-in duration-300"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                >
                  <div className="w-full md:w-40 h-32 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                    <img src={rental.itemId?.images?.[0] || "https://placehold.co/400"} alt="Item" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-heading text-xl font-bold text-slate-900 tracking-tight">{rental.itemId?.title || 'Unknown Item'}</h3>
                        <p className="text-sm font-medium text-slate-500">Owner: {rental.ownerId?.fullname || 'Unknown'}</p>
                      </div>
                      {renderStatusBadge(rental.status)}
                    </div>
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <CalendarDays className="w-4 h-4 text-indigo-500" />
                        <span>{new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-indigo-600">
                        <CreditCard className="w-4 h-4" />
                        <span>₹{rental.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <ShoppingBag className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">No active rentals</h3>
              <p className="text-slate-500 font-medium mb-6">You haven't rented any items yet.</p>
              <Link to="/browse">
                <Button className="rounded-xl px-8 font-bold shadow-lg shadow-indigo-600/20">Browse Items</Button>
              </Link>
            </div>
          )
        )}

        {/* "Requests Received" Tab */}
        {!isLoading && activeTab === 'requests' && (
          requests.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {requests.filter(Boolean).map((request, index) => (
                <div 
                  key={request._id} 
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all animate-in slide-in-from-bottom-4 fade-in duration-300"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                >
                  <div className="w-full md:w-40 h-32 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                    <img src={request.itemId?.images?.[0] || "https://placehold.co/400"} alt="Item" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-heading text-xl font-bold text-slate-900 tracking-tight">{request.itemId?.title || 'Unknown Item'}</h3>
                        <p className="text-sm font-medium text-slate-500">Requested by: {request.borrowerId?.fullname || 'Unknown'}</p>
                      </div>
                      {renderStatusBadge(request.status)}
                    </div>
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <CalendarDays className="w-4 h-4 text-indigo-500" />
                        <span>{new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-indigo-600">
                        <CreditCard className="w-4 h-4" />
                        <span>₹{request.totalPrice}</span>
                      </div>
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex gap-3 pt-2">
                        <Button 
                          onClick={() => handleStatusUpdate(request._id, 'approved')} 
                          className="bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20 font-bold px-6 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                        </Button>
                        <Button 
                          onClick={() => handleStatusUpdate(request._id, 'rejected')} 
                          variant="outline" 
                          className="rounded-xl font-bold px-6 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                        >
                          <XCircle className="w-4 h-4 mr-2" /> Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Clock className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">No pending requests</h3>
              <p className="text-slate-500 font-medium">You don't have any requests for your items right now.</p>
            </div>
          )
        )}
      </main>
    </div>
  );
}
