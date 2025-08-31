import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../lib/axios";
import { API_ENDPOINTS } from "../../constants/api";
import type { Ticket, TicketDetail } from "../../types";

interface TicketsState {
  tickets: Ticket[];
  currentTicket: TicketDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: TicketsState = {
  tickets: [],
  currentTicket: null,
  loading: false,
  error: null,
};

export const fetchAgentSuggestion = createAsyncThunk(
  "tickets/fetchAgentSuggestion",
  async (ticketId: string) => {
    const maxRetries = 5; // how many times to retry
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await api.get(`/agent/suggestion/${ticketId}`);

        if (response.data) {
          return response.data; // success
        }
      } catch (err) {
        console.warn(`Attempt ${attempt} failed for suggestion`, err);
      }

      // Wait before retrying (exponential backoff)
      await delay(1000 * attempt);
    }

    throw new Error("No suggestion found after retries");
  }
);

export const updateAgentSuggestion = createAsyncThunk(
  "tickets/updateAgentSuggestion",
  async (
    {
      suggestionId,
      draftReply,
      articleIds,
    }: { suggestionId: string; draftReply?: string; articleIds?: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/agent/suggestion/${suggestionId}`, {
        draftReply,
        articleIds,
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update agent suggestion"
      );
    }
  }
);

export const fetchTickets = createAsyncThunk(
  "tickets/fetchTickets",
  async ({ status, mine }: { status?: string; mine?: boolean } = {}) => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (mine) params.append("mine", "true");

    const response = await api.get<Ticket[]>(
      `${API_ENDPOINTS.TICKETS}?${params}`
    );
    return response.data;
  }
);

export const fetchTicketDetail = createAsyncThunk(
  "tickets/fetchTicketDetail",
  async (ticketId: string) => {
    const response = await api.get<TicketDetail>(
      API_ENDPOINTS.TICKET_BY_ID(ticketId)
    );
    return response.data;
  }
);

export const createTicket = createAsyncThunk(
  "tickets/createTicket",
  async ({
    title,
    description,
    category,
  }: {
    title: string;
    description: string;
    category?: string;
  }) => {
    // Step 1: Create the ticket
    const ticketResponse = await api.post<Ticket>(API_ENDPOINTS.TICKETS, {
      title,
      description,
      category,
    });

    const newTicket = ticketResponse.data;

    // Step 2: Try fetching suggestion with retries
    let suggestion = null;
    const maxRetries = 5;

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const suggestionResponse = await api.get(
          API_ENDPOINTS.AGENT_SUGGESTION(newTicket._id)
        );

        if (suggestionResponse.data) {
          suggestion = suggestionResponse.data;
          break; // ✅ success, stop retrying
        }
      } catch (err) {
        console.warn(
          `Suggestion fetch attempt ${attempt} failed for ticket ${newTicket._id}`
        );
      }

      // Wait before next retry (1s, 2s, 3s…)
      await delay(1000 * attempt);
    }

    return { ticket: newTicket, suggestion };
  }
);

export const replyToTicket = createAsyncThunk(
  "tickets/replyToTicket",
  async ({
    ticketId,
    message,
    close,
    reopen,
  }: {
    ticketId: string;
    message: string;
    close?: boolean;
    reopen?: boolean;
  }) => {
    const response = await api.post(API_ENDPOINTS.TICKET_REPLY(ticketId), {
      message,
      close,
      reopen,
    });
    return response.data;
  }
);

export const assignTicket = createAsyncThunk(
  "tickets/assignTicket",
  async ({
    ticketId,
    assigneeId,
  }: {
    ticketId: string;
    assigneeId: string;
  }) => {
    const response = await api.post<Ticket>(
      API_ENDPOINTS.TICKET_ASSIGN(ticketId),
      {
        assigneeId,
      }
    );
    return response.data;
  }
);

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTickets.fulfilled,
        (state, action: PayloadAction<Ticket[]>) => {
          state.loading = false;
          state.tickets = action.payload;
        }
      )
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tickets";
      })
      .addCase(fetchTicketDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTicketDetail.fulfilled,
        (state, action: PayloadAction<TicketDetail>) => {
          state.loading = false;
          state.currentTicket = action.payload;
        }
      )
      .addCase(fetchTicketDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch ticket details";
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        const { ticket, suggestion } = action.payload;
        state.tickets.unshift(ticket);

        // If you want, you can also store suggestion inside currentTicket
        state.currentTicket = {
          ...ticket,
          suggestion,
        } as unknown as TicketDetail;
      })
      .addCase(replyToTicket.fulfilled, (state) => {
        // Refresh ticket detail after reply
        if (state.currentTicket) {
          state.currentTicket = null;
        }
      })
      .addCase(fetchAgentSuggestion.fulfilled, (state, action) => {
        if (state.currentTicket) {
          // Merge suggestion into existing ticket
          state.currentTicket = {
            ...state.currentTicket,
            suggestion: action.payload,
          };
        } else {
          // If no currentTicket loaded, still store suggestion separately
          state.currentTicket = {
            suggestion: action.payload,
          } as unknown as TicketDetail;
        }
      })
      .addCase(updateAgentSuggestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAgentSuggestion.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentTicket) {
          // merge the updated suggestion into currentTicket
          state.currentTicket = {
            ...state.currentTicket,
            suggestion: action.payload,
          };
        }
      })
      .addCase(updateAgentSuggestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentTicket } = ticketsSlice.actions;
export default ticketsSlice.reducer;
