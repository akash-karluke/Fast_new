import { configureStore } from "@reduxjs/toolkit";
import filters from "./features/filters";
import user from "./features/user";
import tableData from "./features/tableData";
export const store = configureStore({
  reducer: { filters, user, tableData },
  devTools: process.env.NODE_ENV !== "production",
});
