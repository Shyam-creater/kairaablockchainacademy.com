import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Chip } from "@mui/material";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../../redux/features/orders/ordersApi.js";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { toast } from "react-hot-toast";

const AllOrders = () => {
  const { isLoading, data, refetch } = useGetAllOrdersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const handleApprove = async (orderId) => {
    try {
      const res = await updateOrderStatus({ orderId, status: "verified" }).unwrap();
      if (res.success) {
        toast.success("Payment verified and enrollment approved successfully!");
        refetch();
      } else {
        toast.error(res.message || "Failed to update order status.");
      }
    } catch (err) {
      console.error(err);
      toast.error(typeof (err?.data?.message || "Failed to verify payment.") === "string" ? (err?.data?.message || "Failed to verify payment.") : JSON.stringify(err?.data?.message || "Failed to verify payment.") || "An error occurred");
    }
  };

  const columns = [
    { field: "id", headerName: "Order ID", flex: 0.3 },
    { field: "userName", headerName: "Student Name", flex: 0.5 },
    { field: "userEmail", headerName: "Student Email", flex: 0.8 },
    { field: "courseName", headerName: "Course Name", flex: 0.8 },
    { field: "price", headerName: "Price", flex: 0.3 },
    { field: "method", headerName: "Method", flex: 0.4 },
    { field: "utr", headerName: "UTR / Transaction ID", flex: 0.5 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.4,
      renderCell: (params) => {
        const isVerified = params.row.status === "verified";
        return (
          <Chip
            label={isVerified ? "Verified" : "Pending"}
            style={{
              backgroundColor: isVerified ? "#2ecc71" : "#f1c40f",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "11px",
              height: "24px",
            }}
          />
        );
      },
    },
    { field: "created_at", headerName: "Created At", flex: 0.4 },
    {
      field: "action",
      headerName: "Action",
      flex: 0.4,
      renderCell: (params) => {
        const isPending = params.row.status === "pending";
        return (
          <Button
            variant="contained"
            disabled={!isPending || isUpdating}
            onClick={() => handleApprove(params.row.id)}
            style={{
              backgroundColor: isPending ? "#1C1678" : "#e2e8f0",
              color: isPending ? "#fff" : "#94a3b8",
              textTransform: "none",
              borderRadius: "20px",
              padding: "4px 15px",
              fontSize: "12px",
              fontWeight: "bold",
              boxShadow: isPending ? "0 4px 6px rgba(28,22,120,0.15)" : "none",
            }}
          >
            {isPending ? "Approve" : "Approved"}
          </Button>
        );
      },
    },
  ];

  const rows = [];

  if (data && data.orders) {
    data.orders.forEach((item) => {
      rows.push({
        id: item._id,
        userName: item.userName || "N/A",
        userEmail: item.userEmail || "N/A",
        courseName: item.courseName || "N/A",
        price: item.coursePrice ? `₹${item.coursePrice.toLocaleString("en-IN")}` : "N/A",
        method: item.payment_info?.method || "N/A",
        utr: item.payment_info?.transactionId || "N/A",
        status: item.payment_info?.status || "pending",
        created_at: format(item.createdAt),
      });
    });
  }

  return (
    <div className="">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-[#1C1678] font-headingFont">
              Manual Payments Verification List
            </h2>
            <p className="text-slate-500 text-xs font-paraFont mt-1">
              Verify UTR reference numbers submitted by students to confirm enrollments and grant access.
            </p>
          </div>
          <Box
            m="20px 0 0 0"
            height="80vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
              },
              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                color: "#000",
              },
              "& .MuiDataGrid-sortIcon": {
                color: "#000",
              },
              "& .MuiDataGrid-row": {
                color: "#000",
                borderBottom: "1px solid #ccc !important",
              },
              "& .MuiTablePagination-root": {
                color: "#000",
              },
              "& .MuiIconButton-colorInherit": {
                color: "#000",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: "#000",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: "#F2F0F0",
              },
              "& .MuiDataGrid-footerContainer": {
                color: "#000",
                borderTop: "none",
                backgroundColor: "#5AB2FF",
              },
              "& .MuiCheckbox-root": {
                color: `#000 !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `#fff !important`,
              },
              "& .MuiDataGrid-columnHeader": {
                color: "#000",
                background: "#5AB2FF",
                borderBottom: "none",
              },
            }}
          >
            <DataGrid checkboxSelection columns={columns} rows={rows} />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default AllOrders;
