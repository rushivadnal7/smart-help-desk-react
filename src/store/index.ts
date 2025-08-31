import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import ticketsSlice from "./slices/ticketsSlice"
import kbSlice from "./slices/kbSlice"
import configSlice from "./slices/configSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tickets: ticketsSlice,
    kb: kbSlice,
    config: configSlice,
    // suggestion : 
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
