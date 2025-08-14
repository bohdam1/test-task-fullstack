import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import adsReducer from "./adsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    ads: adsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export {}; 
