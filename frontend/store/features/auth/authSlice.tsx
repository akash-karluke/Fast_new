import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type AuthState = {
  token: string | null;
  user: any;
};

const authSlice = createSlice({
  name: "auth",
  initialState: { token: null, user: null } as AuthState,
  reducers: {
    setToken: (
      state,
      { payload: { token } }: PayloadAction<{ token: string }>
    ) => {
      state.token = token;
    },
    setUser: (
      state,
      { payload: { user } }: PayloadAction<{ user: string }>
    ) => {
      state.user = user;
    },
    clearToken: (state) => {
      state.token = null;
    },
  },
});

export const { setToken, clearToken, setUser } = authSlice.actions;
export default authSlice.reducer;
