import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../services/api";

interface Ad {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  city: string;
  images: string[];
  userId: string;
  createdAt: string;
}

interface AdsState {
  ads: Ad[];
  currentAd: Ad | null; 
  loading: boolean;
  error: string | null;
}

const initialState: AdsState = {
  ads: [],
  currentAd: null,
  loading: false,
  error: null,
};


export const fetchAds = createAsyncThunk("ads/fetchAds", async () => {
  const response = await api.get("/ads");
  return response.data.ads;
});


export const fetchAdById = createAsyncThunk(
  "ads/fetchAdById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/ads/${id}`);
      
      return  response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error");
    }
  }
);


export const createAd = createAsyncThunk(
  "ads/createAd",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.post("/ads", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error");
    }
  }
);


export const updateAd = createAsyncThunk(
  "ads/updateAd",
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.put(`/ads/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error");
    }
  }
);


export const deleteAd = createAsyncThunk(
  "ads/deleteAd",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      await api.delete(`/ads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error");
    }
  }
);

const adsSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAds
      .addCase(fetchAds.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAds.fulfilled, (state, action: PayloadAction<Ad[]>) => {
        state.loading = false;
        state.ads = action.payload;
      })
      .addCase(fetchAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error";
      })
      // fetchAdById
      .addCase(fetchAdById.pending, (state) => {
        state.loading = true;
        state.currentAd = null;
      })
      .addCase(fetchAdById.fulfilled, (state, action: PayloadAction<Ad>) => {
        state.loading = false;
        state.currentAd = action.payload;
      })
      .addCase(fetchAdById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createAd
      .addCase(createAd.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAd.fulfilled, (state, action: PayloadAction<Ad>) => {
        state.loading = false;
        state.ads.unshift(action.payload);
      })
      .addCase(createAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateAd
      .addCase(updateAd.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAd.fulfilled, (state, action: PayloadAction<Ad>) => {
        state.loading = false;
        const index = state.ads.findIndex((ad) => ad._id === action.payload._id);
        if (index !== -1) {
          state.ads[index] = action.payload;
        }
      })
      .addCase(updateAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // deleteAd
      .addCase(deleteAd.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAd.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.ads = state.ads.filter((ad) => ad._id !== action.payload);
      })
      .addCase(deleteAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default adsSlice.reducer;
