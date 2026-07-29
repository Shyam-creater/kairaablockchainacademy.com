import React from "react";
import { Drawer, Box } from "@mui/material";
import { FiX, FiDownload, FiUser, FiBook, FiDollarSign, FiClock, FiCheckCircle } from "react-icons/fi";

const NeetOrder360Drawer = ({ order, open, onClose }) => {
  if (!order) return null;

  const handleDownloadReceipt = () => {
    // Generate simple receipt for printing
    const printWindow = window.open('', '', 'height=800,width=800');
    if (!printWindow) return;

    printWindow.document.write('<html><head><title>NEET Purchase Receipt</title>');
    printWindow.document.write(`
      <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #333; }
        .header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .title { font-size: 24px; font-weight: bold; }
        .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .label { font-weight: bold; }
      </style>
    `);
    printWindow.document.write('</head><body>');
    printWindow.document.write(`
      <div class="header">
        <div class="title">INVOICE: NEET Question Bank</div>
        <p>Kairaa Blockchain Academy</p>
      </div>
      <div class="row"><span class="label">Purchase ID:</span><span>${order.id}</span></div>
      <div class="row"><span class="label">Date:</span><span>${order.createdAtRaw ? new Date(order.createdAtRaw).toLocaleString() : order.created_at}</span></div>
      <div class="row"><span class="label">Billed To:</span><span>${order.userName} (${order.userEmail})</span></div>
      <br/>
      <div class="row"><span class="label">Item:</span><span>${order.fileTitle} (${order.year} - ${order.subject})</span></div>
      <div class="row"><span class="label">Amount:</span><span>₹${order.amount}</span></div>
      <div class="row"><span class="label">Payment ID:</span><span>${order.paymentId}</span></div>
      <div class="row"><span class="label">Status:</span><span>PAID</span></div>
    `);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: "450px" },
          background: "transparent",
          backdropFilter: "blur(20px)",
        },
      }}
    >
      <Box className="h-full bg-[#111C43]/90 border-l border-white/10 flex flex-col relative overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 flex items-center justify-between border-b border-white/10 bg-[#111C43]/95 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            NEET Purchase Details
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-6 space-y-8 flex-1">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Payment Status
            </span>
            <div className="px-3 py-1 bg-success/20 text-success border border-success/30 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,230,118,0.2)]">
              <FiCheckCircle size={14} /> Confirmed
            </div>
          </div>

          {/* User Profile Card */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xl font-bold shadow-[0_0_15px_rgba(0,242,254,0.3)] overflow-hidden">
                {order.userName ? order.userName.charAt(0).toUpperCase() : <FiUser />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {order.userName || "Unknown User"}
                </h3>
                <p className="text-sm text-slate-400 truncate w-[200px]">
                  {order.userEmail || order.userId}
                </p>
              </div>
            </div>
          </div>

          {/* Purchased Item Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <FiBook /> Purchased Question Paper
            </h4>
            <div className="bg-black/20 border border-slate-600 rounded-xl p-4">
              <h3 className="text-white font-bold mb-2">{order.fileTitle}</h3>
              <div className="flex gap-2 mb-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-bold uppercase">{order.subject}</span>
                <span className="text-xs bg-white/10 text-white px-2 py-1 rounded font-bold">{order.year}</span>
              </div>
              <p className="text-sm text-primary font-bold">
                ₹{order.amount?.toLocaleString() || "—"}
              </p>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <FiDollarSign /> Transaction Info
            </h4>
            <div className="bg-black/20 border border-slate-600 rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Purchase ID</span>
                <span className="text-sm font-mono text-white truncate max-w-[150px]" title={order.id}>{order.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Payment ID</span>
                <span className="text-sm font-mono text-primary truncate max-w-[150px]">{order.paymentId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Date</span>
                <span className="text-sm text-white flex items-center gap-1">
                  <FiClock size={12} className="text-slate-400" /> {order.created_at}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-[#111C43]/95 backdrop-blur-md">
          <button 
            onClick={handleDownloadReceipt}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-slate-600 text-white font-bold uppercase tracking-wider hover:bg-white/10 transition-all hover:border-primary/50"
          >
            <FiDownload size={18} /> Download Receipt
          </button>
        </div>
      </Box>
    </Drawer>
  );
};

export default NeetOrder360Drawer;
