import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { userProps } from "./user";

const userInitState: { user: userProps } = {
  user: {
    userId: null,
    displayName: "",
    emailId: "",
    avatarLink: "",
    role: "",
    profile: "",
  },
};

export const fetchUser = (email: string) => {
  return axios.get(
    //`${process.env.NEXT_PUBLIC_API_BASE_URL}salesRep/getSalesRepByEmail/${email}`
    `${process.env.NEXT_PUBLIC_API_BASE_URL}salesRep/getSalesRepByEmail/gursimran.singh@tredence.com`
  );
};

export const userSlice = createSlice({
  name: "user",
  initialState: userInitState,
  reducers: {
    addUser: (state, action: PayloadAction<any>) => {
      const {
        SalesRepID,
        SalesRepEmailID,
        SalesRepFirstName,
        SalesRepMiddleName,
        SalesRepManagerID,
        avatarUrl
      } = action.payload;
      state.user = {
        userId: SalesRepID,
        displayName: SalesRepFirstName + " " + SalesRepMiddleName,
        emailId: "",
        avatarLink: avatarUrl.trim(),
        role: "",
        profile: "",
      };
    },
  },
});
export const { addUser } = userSlice.actions;
export default userSlice.reducer;
