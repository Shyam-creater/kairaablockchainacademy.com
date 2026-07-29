import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiBookOpen, FiDownload, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
const SERVER_URI = process.env.REACT_APP_PUBLIC_SERVER_URI || 'http://localhost:8000/api/v1';

const StudentNeetManagement = () => {
  const [years, setYears] = useState([]);
  const [selectedYearObj, setSelectedYearObj] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [loading, setLoading] = useState(true);
  const [unlockedFiles, setUnlockedFiles] = useState([]);
  const { user } = useSelector((state) => state.auth || {});

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (file) => {
    const res = await loadRazorpay();

    if (!res) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || process.env.RAZORPAY_PUBLISHABLE_KEY, 
      amount: 10 * 100, // ₹10 per paper
      currency: 'INR',
      name: 'Kairaa Blockchain Academy',
      description: `Unlock NEET Paper: ${file.title}`,
      handler: async function (response) {
        try {
          const purchaseRes = await fetch(`${SERVER_URI}/neet/purchase`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              yearId: selectedYearObj._id,
              year: selectedYearObj.year,
              fileId: file._id,
              fileTitle: file.title,
              subject: file.subject || 'General',
              amount: 10 * 100,
              paymentId: response.razorpay_payment_id
            })
          });
          const purchaseData = await purchaseRes.json();
          if(purchaseData.success) {
            setUnlockedFiles(prev => [...prev, file._id]);
            toast.success('Payment successful! Paper unlocked.');
          } else {
            toast.error(purchaseData.message || 'Failed to record purchase. Contact support.');
          }
        } catch(err) {
          console.error("Purchase error", err);
          toast.error("Failed to verify purchase. Contact support.");
        }
      },
      prefill: {
        name: user?.name || "Student",
        email: user?.email || "student@example.com",
        contact: user?.phoneNumber || "9999999999"
      },
      theme: {
        color: '#0B0F19'
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  useEffect(() => {
    fetchYears();
    fetchMyPurchases();
  }, []);

  const fetchMyPurchases = async () => {
    try {
      const res = await fetch(`${SERVER_URI}/neet/my-purchases`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        const fileIds = data.purchases.map(p => p.fileId);
        setUnlockedFiles(fileIds);
      }
    } catch (err) {
      console.error('Failed to fetch my purchases', err);
    }
  };

  const fetchYears = async () => {
    try {
      const res = await fetch(`${SERVER_URI}/neet/all`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setYears(data.neets);
        if (data.neets.length > 0) {
          setSelectedYearObj(data.neets[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch years', err);
    } finally {
      setLoading(false);
    }
  };

  const handleYearSelect = (e) => {
    const yId = e.target.value;
    const found = years.find(y => y._id === yId);
    if (found) {
      setSelectedYearObj(found);
      setSelectedSubject('All');
    }
  };

  // Get unique subjects for the selected year
  const availableSubjects = selectedYearObj 
    ? [...new Set(selectedYearObj.files.map(f => f.subject || 'General'))] 
    : [];
    
  const filteredFiles = selectedYearObj 
    ? (selectedSubject === 'All' 
        ? selectedYearObj.files 
        : selectedYearObj.files.filter(f => (f.subject || 'General') === selectedSubject))
    : [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-primary border-opacity-80"></div>
      </div>
    );
  }

  if (years.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="w-20 h-20 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[#9CA3AF] mb-6">
          <FiBookOpen size={32} />
        </div>
        <h2 className="text-2xl font-bold text-[#111827] mb-2">NEET Question Banks</h2>
        <p className="text-[#6B7280]">No NEET question banks are currently available.</p>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-[#FAFAFA] font-sans relative">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10 shrink-0">
        <div className="max-w-[1200px] mx-auto w-full px-6 py-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight">NEET Prep Resources</h1>
              <p className="text-sm text-[#6B7280] mt-1">Access previous year question banks and materials</p>
            </div>
            
            <div className="w-full lg:w-auto">
              <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">Select Year</label>
              <select 
                onChange={handleYearSelect}
                value={selectedYearObj ? selectedYearObj._id : ''}
                className="w-full lg:w-48 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-2 text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm font-medium"
              >
                {years.map(y => (
                  <option key={y._id} value={y._id}>{y.year}</option>
                ))}
              </select>
            </div>

            {selectedYearObj && availableSubjects.length > 0 && (
              <div className="w-full lg:w-auto mt-4 lg:mt-0">
                <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">Subject / Language</label>
                <select 
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  value={selectedSubject}
                  className="w-full lg:w-48 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-2 text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm font-medium"
                >
                  <option value="All">All Subjects</option>
                  {availableSubjects.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-8 bg-[#FAFAFA]">
        <div className="max-w-[1200px] mx-auto">
          {selectedYearObj && (
            <>
              <h3 className="text-lg font-bold text-[#111827] mb-6 flex items-center gap-2">
                <FiCheckCircle className="text-primary" />
                Resources for {selectedYearObj.year}
              </h3>
              
              {filteredFiles.length === 0 ? (
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center shadow-sm">
                  <p className="text-[#6B7280]">No files found for this selection.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFiles.map(file => (
                    <div 
                      key={file._id} 
                      className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col hover:border-primary/40 hover:shadow-md transition-all group"
                    >
                      <div className="flex-1 mb-4 flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#EFF6FF] rounded-lg flex items-center justify-center text-primary shrink-0 mt-0.5">
                          <FiBookOpen size={18} />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full mb-1 inline-block">
                            {file.subject || 'General'}
                          </span>
                          <h4 className="font-bold text-[#111827] text-sm leading-snug line-clamp-2" title={file.title}>
                            {file.title}
                          </h4>
                        </div>
                      </div>
                      {unlockedFiles.includes(file._id) ? (
                        <a 
                          href={file.fileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-full flex items-center justify-center gap-2 bg-[#F9FAFB] text-[#4B5563] border border-[#E5E7EB] font-bold text-sm py-2 rounded-lg hover:bg-primary hover:text-black hover:border-primary transition-colors"
                        >
                          <FiDownload size={16} /> View / Download
                        </a>
                      ) : (
                        <button 
                          onClick={() => handlePayment(file)}
                          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm py-2 rounded-lg hover:from-amber-600 hover:to-amber-700 shadow-md hover:shadow-lg transition-all"
                        >
                          <FiLock size={16} /> Pay ₹10 to Unlock
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentNeetManagement;
