import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import api from "../../lib/axios"
import { API_ENDPOINTS } from "../../constants/api"
import type { Article } from "../../types"

interface KbState {
  articles: Article[]
  loading: boolean
  error: string | null
}

const initialState: KbState = {
  articles: [],
  loading: false,
  error: null,
}

export const fetchArticles = createAsyncThunk(
  "kb/fetchArticles",
  async ({ query, status }: { query?: string; status?: string } = {}) => {
    const params = new URLSearchParams()
    if (query) params.append("query", query)
    if (status) params.append("status", status)

    const response = await api.get<Article[]>(`${API_ENDPOINTS.KB}?${params}`)
    return response.data
  },
)

export const createArticle = createAsyncThunk(
  "kb/createArticle",
  async ({
    title,
    body,
    tags,
    status,
  }: {
    title: string
    body: string
    tags: string[]
    status: "draft" | "published"
  }) => {
    const response = await api.post<Article>(API_ENDPOINTS.KB, {
      title,
      body,
      tags,
      status,
    })
    return response.data
  },
)

export const updateArticle = createAsyncThunk(
  "kb/updateArticle",
  async ({
    id,
    title,
    body,
    tags,
    status,
  }: {
    id: string
    title?: string
    body?: string
    tags?: string[]
    status?: "draft" | "published"
  }) => {
    const response = await api.put<Article>(API_ENDPOINTS.KB_BY_ID(id), {
      title,
      body,
      tags,
      status,
    })
    return response.data
  },
)

export const deleteArticle = createAsyncThunk("kb/deleteArticle", async (id: string) => {
  await api.delete(API_ENDPOINTS.KB_BY_ID(id))
  return id
})

const kbSlice = createSlice({
  name: "kb",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchArticles.fulfilled, (state, action: PayloadAction<Article[]>) => {
        state.loading = false
        state.articles = action.payload
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch articles"
      })
      .addCase(createArticle.fulfilled, (state, action: PayloadAction<Article>) => {
        state.articles.unshift(action.payload)
      })
      .addCase(updateArticle.fulfilled, (state, action: PayloadAction<Article>) => {
        const index = state.articles.findIndex((article) => article._id === action.payload._id)
        if (index !== -1) {
          state.articles[index] = action.payload
        }
      })
      .addCase(deleteArticle.fulfilled, (state, action: PayloadAction<string>) => {
        state.articles = state.articles.filter((article) => article._id !== action.payload)
      })
  },
})

export const { clearError } = kbSlice.actions
export default kbSlice.reducer
