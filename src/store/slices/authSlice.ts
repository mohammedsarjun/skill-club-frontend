import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Role = "freelancer" | "client" | "admin";

export interface User {
  userId: string;
  roles: Role[];      
  activeRole: Role;  
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    setActiveRole(state, action: PayloadAction<Role>) {
      if (state.user) {
        state.user.activeRole = action.payload;
      }
    },

    clearUser(state) {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },

    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setUser,
  setActiveRole,
  clearUser,
  setAuthLoading,
  setAuthError,
} = authSlice.actions;

export default authSlice.reducer;
