import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import api from "../../lib/axios"
import { API_ENDPOINTS } from "../../constants/api"
import type { Config } from "../../types"

interface ConfigState {
  config: Config | null
  loading: boolean
  error: string | null
}

const initialState: ConfigState = {
  config: null,
  loading: false,
  error: null,
}

export const fetchConfig = createAsyncThunk("config/fetchConfig", async () => {
  const response = await api.get<Config>(API_ENDPOINTS.CONFIG)
  return response.data
})

export const updateConfig = createAsyncThunk("config/updateConfig", async (configData: Partial<Config>) => {
  const response = await api.put<Config>(API_ENDPOINTS.CONFIG, configData)
  return response.data
})

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfig.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchConfig.fulfilled, (state, action: PayloadAction<Config>) => {
        state.loading = false
        state.config = action.payload
      })
      .addCase(fetchConfig.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch config"
      })
      .addCase(updateConfig.fulfilled, (state, action: PayloadAction<Config>) => {
        state.config = action.payload
      })
  },
})

export const { clearError } = configSlice.actions
export default configSlice.reducer
