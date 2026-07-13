import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSlice.js";
import authSlice from "./features/auth/authslice.js";
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,

  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
console.log(store.getState());

const initializeApp = async () => {
  await store.dispatch(
    apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true })
  );
};

initializeApp();
