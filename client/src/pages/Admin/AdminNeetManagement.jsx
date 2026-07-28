import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiSave, FiFile, FiDownload, FiStar } from 'react-icons/fi';
import Heading from "../../components/Heading.js";
import AdminLayout from "../../components/Admin/AdminLayout.js";

const SERVER_URI = process.env.REACT_APP_PUBLIC_SERVER_URI || 'http://localhost:8000/api/v1';

const AdminNeetManagement = () => {
  const [activeTab, setActiveTab] = useState('question-bank'); // 'question-bank' or 'sponsorships'
  
  // Question Bank State
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [newYearInput, setNewYearInput] = useState('');
  const [files, setFiles] = useState([]);
  const [titleInput, setTitleInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('English');
  const [fileUrlInput, setFileUrlInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Sponsorship Request State
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    fetchYears();
    fetchRequests();
  }, []);

  const fetchYears = async () => {
    try {
      const res = await fetch(`${SERVER_URI}/neet/all`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setYears(data.neets);
      }
    } catch (err) {
      console.error('Failed to fetch years', err);
    }
  };

  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await fetch(`${SERVER_URI}/sponsor-requests/all`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error('Failed to fetch sponsor requests', err);
    }
    setLoadingRequests(false);
  };

  const toggleHighlight = async (id) => {
    try {
      const res = await fetch(`${SERVER_URI}/sponsor-requests/highlight/${id}`, {
        method: 'PUT',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        fetchRequests();
      } else {
        alert(data.message || "Failed to update highlight status");
      }
    } catch (err) {
      console.error('Failed to toggle highlight', err);
    }
  };

  const deleteRequest = async (id) => {
    if(!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      const res = await fetch(`${SERVER_URI}/sponsor-requests/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        fetchRequests();
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch (err) {
      console.error('Failed to delete request', err);
    }
  };

  const handleAddFile = () => {
    if (!titleInput || !fileUrlInput || !subjectInput) return alert('Title, Subject, and File URL required');
    setFiles([...files, { title: titleInput, subject: subjectInput, fileUrl: fileUrlInput }]);
    setTitleInput('');
    setFileUrlInput('');
  };

  const handleSaveYear = async () => {
    const yearToSave = selectedYear === 'new' ? newYearInput : selectedYear;
    if (!yearToSave) return alert('Year is required');

    let finalFiles = [...files];
    if (titleInput && fileUrlInput && subjectInput) {
      finalFiles.push({ title: titleInput, subject: subjectInput, fileUrl: fileUrlInput });
    } else if ((titleInput && !fileUrlInput) || (!titleInput && fileUrlInput)) {
      alert("Please provide a Title, Subject, and select a File for your pending upload, or clear them.");
      return;
    }

    if (finalFiles.length === 0) {
      if (!window.confirm("You are about to save this year without any files. Continue?")) return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${SERVER_URI}/neet/create-or-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ year: Number(yearToSave), files: finalFiles })
      });
      
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { return alert('Error parsing response'); }

      if (data.success) {
        alert('Saved successfully');
        setFiles([]);
        setTitleInput('');
        setFileUrlInput('');
        const fileInput = document.getElementById('neetFile');
        if (fileInput) fileInput.value = '';
        setSelectedYear('');
        setNewYearInput('');
        fetchYears();
      } else {
        alert(data.message || 'Failed to save');
      }
    } catch (err) {
      alert('Error saving: Network or fetch failed');
    }
    setLoading(false);
  };

  const handleDeleteYear = async (yearId) => {
    if (!window.confirm('Delete this entire year?')) return;
    try {
      const res = await fetch(`${SERVER_URI}/neet/delete-year/${yearId}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) fetchYears();
    } catch (err) {}
  };

  const handleDeleteFile = async (yearId, fileId) => {
    if (!window.confirm('Delete this file?')) return;
    try {
      const res = await fetch(`${SERVER_URI}/neet/delete-file/${yearId}/${fileId}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) fetchYears();
    } catch (err) {}
  };

  return (
    <>
      <Heading title="NEET Management | Admin Portal" description="Manage your academy's NEET prep resources" />
      <AdminLayout title="NEET Management" subtitle="View and manage all NEET question banks and sponsors">
        <div className="w-full h-full p-6 text-white max-w-6xl mx-auto overflow-y-auto">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 mb-8">
            <button 
              onClick={() => setActiveTab('sponsorships')}
              className={`px-6 py-3 font-semibold text-lg transition-colors border-b-2 ${activeTab === 'sponsorships' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              Sponsorship Requests
            </button>
            <button 
              onClick={() => setActiveTab('question-bank')}
              className={`px-6 py-3 font-semibold text-lg transition-colors border-b-2 ${activeTab === 'question-bank' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              NEET Question Banks
            </button>
          </div>

          {activeTab === 'sponsorships' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Student Sponsorship Requests</h2>
                <div className="bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-bold">
                  Highlighted: {requests.filter(r => r.isHighlighted).length} / 5
                </div>
              </div>
              
              {loadingRequests ? (
                <p className="text-gray-400">Loading requests...</p>
              ) : requests.length === 0 ? (
                <div className="bg-gray-800 border border-gray-700 p-8 text-center rounded-xl">
                  <p className="text-gray-400">No sponsorship requests found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {requests.map(req => (
                    <div key={req._id} className={`bg-gray-800 p-5 rounded-xl border ${req.isHighlighted ? 'border-primary shadow-[0_0_15px_rgba(0,242,254,0.3)]' : 'border-gray-700'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          {req.imageUrl ? (
                            <img src={req.imageUrl} alt={req.name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-600" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold">
                              {req.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-lg text-white">{req.name}</h3>
                            <p className="text-sm text-gray-400">{req.email}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleHighlight(req._id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${req.isHighlighted ? 'bg-primary text-black' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                          title="Highlight to show on the public NEET page"
                        >
                          <FiStar className={req.isHighlighted ? "fill-black" : ""} />
                          {req.isHighlighted ? 'Highlighted' : 'Highlight'}
                        </button>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-1">Contact Number:</p>
                        <p className="font-mono text-white">{req.contactNumber}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-400 mb-1">Reason for Request:</p>
                        <p className="text-sm text-gray-300 bg-gray-900 p-3 rounded-lg leading-relaxed">{req.reason}</p>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-700 text-right">
                        <button onClick={() => deleteRequest(req._id)} className="text-red-400 hover:text-red-300 text-sm font-semibold flex items-center gap-1 ml-auto">
                          <FiTrash2 /> Delete Request
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'question-bank' && (
            <>
              {/* Upload Section */}
              <div className="bg-gray-800 p-6 rounded-xl mb-10 shadow-lg border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Add or Update Year</h2>
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-1">Select Year</label>
                  <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white">
                    <option value="">-- Select a Year --</option>
                    <option value="new">+ Create New Year</option>
                    {years.map(y => <option key={y._id} value={y.year}>{y.year}</option>)}
                  </select>
                </div>
                {selectedYear === 'new' && (
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-1">New Year</label>
                    <input type="number" value={newYearInput} onChange={(e) => setNewYearInput(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white" placeholder="e.g. 2023" />
                  </div>
                )}
                <div className="mt-6 p-4 border border-gray-600 rounded bg-gray-900/50">
                  <h3 className="text-lg mb-3">Add Files</h3>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm text-gray-400 mb-1">File Title (What user sees)</label>
                      <input type="text" value={titleInput} onChange={(e) => setTitleInput(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white" placeholder="e.g. Question Paper 2023" />
                    </div>
                    <div className="flex-1 min-w-[150px]">
                      <label className="block text-sm text-gray-400 mb-1">Language / Subject</label>
                      <select value={subjectInput} onChange={(e) => setSubjectInput(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white">
                        <option value="English">English</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Biology">Biology</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm text-gray-400 mb-1">Select File (PDF, Image, etc.)</label>
                      <input type="file" id="neetFile" onChange={(e) => {
                        const file = e.target.files[0];
                        if(file) {
                          if (file.size > 10 * 1024 * 1024) return alert("File size exceeds 10 MB.");
                          const reader = new FileReader();
                          reader.onload = () => { if(reader.readyState === 2) setFileUrlInput(reader.result); }
                          reader.readAsDataURL(file);
                        } else setFileUrlInput('');
                      }} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-cyan-400" />
                    </div>
                    <div className="flex items-end">
                      <button onClick={() => { handleAddFile(); const fileInput = document.getElementById('neetFile'); if (fileInput) fileInput.value = ''; }} className="bg-primary text-black font-bold px-4 py-2 rounded flex items-center gap-2 hover:bg-cyan-400">+ Add File</button>
                    </div>
                  </div>
                  {files.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Files to upload:</h4>
                      <ul className="space-y-2">
                        {files.map((f, i) => (
                          <li key={i} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                            <span className="truncate max-w-[80%]">[{f.subject}] {f.title}</span>
                            <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button onClick={handleSaveYear} disabled={loading} className="mt-6 w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-500 disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Year & Files'}
                </button>
              </div>

              {/* List Section */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Existing Data</h2>
                {years.length === 0 ? <p className="text-gray-400">No NEET records found.</p> : (
                  <div className="space-y-6">
                    {years.map(y => (
                      <div key={y._id} className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold text-white">Year: {y.year}</h3>
                          <button onClick={() => handleDeleteYear(y._id)} className="text-red-500 hover:text-red-400 text-sm font-semibold">Delete Year</button>
                        </div>
                        {y.files.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {y.files.map(f => (
                              <div key={f._id} className="bg-gray-900 p-3 rounded border border-gray-700 flex justify-between items-center">
                                <div>
                                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{f.subject || 'General'}</span>
                                  <p className="font-semibold">{f.title}</p>
                                  <a href={f.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 mt-2 bg-primary/10 text-primary px-3 py-1.5 rounded-md hover:bg-primary/20 transition-colors w-max text-sm font-semibold"><FiDownload size={14} /> View File</a>
                                </div>
                                <button onClick={() => handleDeleteFile(y._id, f._id)} className="text-red-500 hover:text-red-400">X</button>
                              </div>
                            ))}
                          </div>
                        ) : <p className="text-gray-500 text-sm">No files uploaded yet.</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </AdminLayout>
    </>
  );
};

export default AdminNeetManagement;
