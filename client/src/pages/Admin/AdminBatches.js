import React, { useState } from "react";
import Heading from "../../components/Heading";
import AdminLayout from "../../components/Admin/AdminLayout";
import { Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { useGetAllBatchesQuery, useCreateBatchMutation, useAddStudentToBatchMutation, useGetAdminUsersQuery } from "../../redux/features/admin/adminApi";
import { useGetAllCoursesQuery } from "../../redux/features/courses/coursesApi";
import toast from "react-hot-toast";

const AdminBatches = () => {
  const { data: batchesData, isLoading: isLoadingBatches, refetch: refetchBatches } = useGetAllBatchesQuery();
  const { data: coursesData } = useGetAllCoursesQuery({});
  const { data: usersData } = useGetAdminUsersQuery({ role: "staff", limit: 100 });
  const { data: studentUsersData } = useGetAdminUsersQuery({ role: "student", limit: 1000 }); // To add students to batch
  
  const [createBatch, { isLoading: isCreating }] = useCreateBatchMutation();
  const [addStudentToBatch, { isLoading: isAddingStudent }] = useAddStudentToBatchMutation();

  const [openCreate, setOpenCreate] = useState(false);
  const [newBatchName, setNewBatchName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");

  const [openAddStudent, setOpenAddStudent] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const batches = batchesData?.batches || [];
  const courses = coursesData?.courses || [];
  const staffMembers = usersData?.users || [];
  const students = studentUsersData?.users || [];

  const handleCreateBatch = async () => {
    if (!newBatchName || !selectedCourse || !selectedStaff) return toast.error("Please fill all fields");
    try {
      await createBatch({ name: newBatchName, courseId: selectedCourse, staffId: selectedStaff }).unwrap();
      toast.success("Batch created successfully");
      setOpenCreate(false);
      setNewBatchName("");
      setSelectedCourse("");
      setSelectedStaff("");
      refetchBatches();
    } catch (error) {
      toast.error(typeof (error?.data?.message || "Failed to create batch") === "string" ? (error?.data?.message || "Failed to create batch") : JSON.stringify(error?.data?.message || "Failed to create batch") || "An error occurred");
    }
  };

  const handleAddStudent = async () => {
    if (!selectedStudentId || !selectedBatchId) return toast.error("Select student and batch");
    try {
      await addStudentToBatch({ batchId: selectedBatchId, studentId: selectedStudentId }).unwrap();
      toast.success("Student added to batch!");
      setOpenAddStudent(false);
      setSelectedStudentId("");
      refetchBatches();
    } catch (error) {
      toast.error(typeof (error?.data?.message || "Failed to add student to batch") === "string" ? (error?.data?.message || "Failed to add student to batch") : JSON.stringify(error?.data?.message || "Failed to add student to batch") || "An error occurred");
    }
  };

  return (
    <>
      <Heading title="Batch Management" description="Manage cohorts and batches" keywords="admin, batches, cohorts" />
      <AdminLayout title="Batch Management" subtitle="Create and manage student batches">
        
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h6" className="font-bold">All Batches</Typography>
          <div className="flex gap-2">
            <Button className="!btn-secondary !px-6 !py-2 !rounded-lg" onClick={() => setOpenAddStudent(true)}>
              Assign Student to Batch
            </Button>
            <Button className="!btn-primary !px-6 !py-2 !rounded-lg" onClick={() => setOpenCreate(true)}>
              + Create Batch
            </Button>
          </div>
        </div>

        {isLoadingBatches ? (
          <Typography>Loading...</Typography>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map(batch => (
              <div key={batch._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <Typography variant="h6" className="font-bold mb-1">{batch.name}</Typography>
                <Typography variant="body2" color="textSecondary" className="mb-4">Course: {batch.courseId?.name}</Typography>
                
                <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm text-blue-800">
                  <strong>Mentor:</strong> {batch.staffId?.name} ({batch.staffId?.email})
                </div>

                <Typography variant="subtitle2" className="mb-2 font-bold">Students ({batch.students.length})</Typography>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {batch.students.length === 0 ? (
                    <Typography variant="caption" color="textSecondary">No students assigned yet.</Typography>
                  ) : (
                    batch.students.map(s => (
                      <div key={s._id} className="text-sm bg-gray-50 px-2 py-1 rounded border border-gray-100">
                        {s.name} <span className="text-xs text-gray-500">({s.email})</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
            {batches.length === 0 && (
              <Typography color="textSecondary">No batches found. Create one to get started.</Typography>
            )}
          </div>
        )}

        {/* Create Batch Dialog */}
        <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Batch</DialogTitle>
          <DialogContent dividers className="space-y-4">
            <TextField
              fullWidth
              label="Batch Name (e.g. Blockchain June 2026)"
              value={newBatchName}
              onChange={e => setNewBatchName(e.target.value)}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Course</InputLabel>
              <Select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} label="Select Course">
                {courses.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Assign Mentor (Staff)</InputLabel>
              <Select value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)} label="Assign Mentor (Staff)">
                {staffMembers.map(s => <MenuItem key={s._id} value={s._id}>{s.name} - {s.email}</MenuItem>)}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateBatch} disabled={isCreating}>Create</Button>
          </DialogActions>
        </Dialog>

        {/* Add Student to Batch Dialog */}
        <Dialog open={openAddStudent} onClose={() => setOpenAddStudent(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Assign Student to Batch</DialogTitle>
          <DialogContent dividers className="space-y-4">
            <Typography variant="body2" color="textSecondary" className="mb-2">
              Note: Adding a student to a batch will automatically assign them to the batch's mentor.
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Batch</InputLabel>
              <Select value={selectedBatchId} onChange={e => setSelectedBatchId(e.target.value)} label="Select Batch">
                {batches.map(b => <MenuItem key={b._id} value={b._id}>{b.name} ({b.courseId?.name})</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Student</InputLabel>
              <Select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} label="Select Student">
                {students.map(s => <MenuItem key={s._id} value={s._id}>{s.name} - {s.email}</MenuItem>)}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddStudent(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddStudent} disabled={isAddingStudent}>Assign Student</Button>
          </DialogActions>
        </Dialog>

      </AdminLayout>
    </>
  );
};

export default AdminBatches;
