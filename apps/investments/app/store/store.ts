import { configureStore } from "@reduxjs/toolkit";
import investmentsReducer from "./investments/investmentsSlice";

export const createAppStore = () => {
  return configureStore({
    reducer: {
      investments: investmentsReducer,
    },
  });
};

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
