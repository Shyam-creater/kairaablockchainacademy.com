import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Create blog
export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (blogData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_PUBLIC_SERVER_URI}/create-blog`,
        blogData,
        config
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get all blogs
export const getAllBlogs = createAsyncThunk(
  "blog/getAllBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_PUBLIC_SERVER_URI}/get-all-blogs`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete blog
export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_PUBLIC_SERVER_URI}/delete-blog/${id}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update blog
export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_PUBLIC_SERVER_URI}/update-blog/${id}`,
        data,
        config
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBlog.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
      // Get All Blogs
      .addCase(getAllBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs;
      })
      .addCase(getAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
      // Update Blog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBlog.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
      // Delete Blog
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBlog.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      });
  },
});

export const { clearError, clearSuccess } = blogSlice.actions;
export default blogSlice.reducer; 