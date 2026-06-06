import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

import {
useGetAllRegistrationsQuery
} from "../../../redux/features/user/userApi.js";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";


const AllRegistrations = () => {


  const { isLoading, data } = useGetAllRegistrationsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "firstName", headerName: "First Name", flex: 0.5 },
    { field: "lastName", headerName: "Last Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phoneNumber", headerName: "Contact No", flex: 0.5 },
    { field: "course", headerName: "Course Name", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.3 },
   
  ];

  const rows = [];

  {
    data &&
      data.registrations.forEach((item) => {
        rows.push({
          id: item._id,
          firstName: item.firstName,
          lastName:item.lastName,
          email: item.email,
          phoneNumber: item.phoneNumber,
          course: item.course,
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
        
          <Box
            m="40px 0 0 0"
            height="80vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
              },
              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                color:"#000",
              },
              "& .MuiDataGrid-sortIcon": {
                color: 
                "#000",
              },
              "& .MuiDataGrid-row": {
                color: "#000",
                borderBottom:"1px solid #ccc !important",
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
                color:`#000 !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `#fff !important`,
              },
              "& .MuiDataGrid-columnHeader": {
                color: "#000",
                background:"#5AB2FF",
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

export default AllRegistrations;
