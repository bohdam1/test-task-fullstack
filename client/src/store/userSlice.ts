import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export interface UserState {
  accessToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  profile: { id: string; name: string; email: string } | null;
}

const initialState: UserState = {
  accessToken: localStorage.getItem("accessToken"),
  status: "idle",
  error: null,
  profile: null,
};

// Отримати профіль
export const getProfile = createAsyncThunk(
  "users/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users/profile");
      return res.data; // { id, name, email }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
    }
  }
);

// Оновити профіль
export const updateProfile = createAsyncThunk(
  "users/updateProfile",
  async (
    data: { name?: string; email?: string; password?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put("/users/profile", data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update profile");
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", data);
      if (res.data.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
      }
      return res.data.accessToken;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (data: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.profile = null;
      state.status = "idle";
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accessToken = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(getProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
