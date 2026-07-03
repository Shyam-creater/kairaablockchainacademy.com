import React from "react";
import Heading from "../../components/Heading";
import AdminLayout from "../../components/Admin/AdminLayout";
import { useGetCertificateRecommendationsQuery, useApproveCertificateMutation } from "../../redux/features/courses/coursesApi";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import { format } from "timeago.js";
import toast from "react-hot-toast";

const AdminCertificateApprovalsPage = () => {
  const { data, isLoading, refetch } = useGetCertificateRecommendationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [approveCertificate, { isLoading: isApproving }] = useApproveCertificateMutation();

  const recommendations = data?.recommendations || [];

  const handleAction = async (id, action) => {
    try {
      await approveCertificate({ recommendationId: id, action }).unwrap();
      toast.success(`Recommendation ${action}d successfully`);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || `Failed to ${action} recommendation`);
    }
  };

  const columns = [
    { field: "studentName", headerName: "Student", flex: 1 },
    { field: "courseName", headerName: "Course", flex: 1 },
    { field: "staffName", headerName: "Recommended By (Staff)", flex: 1 },
    { field: "notes", headerName: "Staff Notes", flex: 1 },
    { field: "createdAt", headerName: "Date", flex: 0.5 },
    { 
      field: "status", 
      headerName: "Status", 
      flex: 0.5,
      renderCell: (params) => {
        const color = params.value === "approved" ? "green" : params.value === "rejected" ? "red" : "orange";
        return <Typography style={{ color, fontWeight: 'bold' }}>{params.value.toUpperCase()}</Typography>;
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => {
        if (params.row.status !== "pending") return null;
        return (
          <div className="flex gap-2">
            <Button 
              variant="contained" 
              color="success" 
              size="small"
              onClick={() => handleAction(params.row.id, "approve")}
              disabled={isApproving}
            >
              Approve
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              size="small"
              onClick={() => handleAction(params.row.id, "reject")}
              disabled={isApproving}
            >
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  const rows = recommendations.map((r) => ({
    id: r._id,
    studentName: r.studentId?.name || "Unknown",
    courseName: r.courseId?.name || "Unknown",
    staffName: r.staffId?.name || "Unknown",
    notes: r.notes || "None",
    status: r.status,
    createdAt: format(r.createdAt),
  }));

  return (
    <>
      <Heading
        title="Certificate Approvals – Admin"
        description="Review and approve certificate recommendations from staff"
        keywords="admin, certificates, approvals"
      />
      <AdminLayout
        title="Certificate Approvals"
        subtitle="Review Staff Recommendations"
      >
        <section className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50]}
              disableSelectionOnClick
              loading={isLoading}
            />
          </Box>
        </section>
      </AdminLayout>
    </>
  );
};

export default AdminCertificateApprovalsPage;
