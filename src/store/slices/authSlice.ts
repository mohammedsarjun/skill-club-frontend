// store/slices/authSlice.ts
// Enhanced Redux-based auth slice with complete user state management
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * User type matching backend response from /auth/me
 */
export interface User {
  userId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles: string[]; // e.g., ['freelancer', 'client', 'admin']
  activeRole: 'freelancer' | 'client' | 'admin' | null;
  
  // Onboarding flags
  isFreelancerOnboarded: boolean;
  isClientOnboarded: boolean;
  
  // Profiles
  clientProfile?: string | undefined;
  freelancerProfile?: string | undefined;
  
  // Block status
  isFreelancerBlocked: boolean;
  isClientBlocked: boolean;
  
  // Additional user data
  avatar?: string;
}

/**
 * Auth state structure
 */
export interface AuthState {
  user: User | null;           // Logged-in user data
  isAuthenticated: boolean;    // Quick auth check
  isLoading: boolean;          // Loading during bootstrap/fetch
  error: string | null;        // Error message if auth fails
}

/**
 * Initial state
 */
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start as loading until bootstrap completes
  error: null,
};

/**
 * Auth slice with actions for managing user state
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Set user data (e.g., after successful login or /auth/me fetch)
     */
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    /**
     * Update active role only (for role switching)
     */
    setActiveRole(state, action: PayloadAction<'freelancer' | 'client' | 'admin'>) {
      if (state.user) {
        state.user.activeRole = action.payload;
      }
    },

    /**
     * Update onboarding status for a specific role
     */
    updateOnboardingStatus(
      state,
      action: PayloadAction<{ role: 'freelancer' | 'client'; completed: boolean }>
    ) {
      if (state.user) {
        if (action.payload.role === 'freelancer') {
          state.user.isFreelancerOnboarded = action.payload.completed;
        } else if (action.payload.role === 'client') {
          state.user.isClientOnboarded = action.payload.completed;
        }
      }
    },

    /**
     * Clear user data (logout)
     */
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    /**
     * Set loading state
     */
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    /**
     * Set error message
     */
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

// Export actions
export const {
  setUser,
  setActiveRole,
  updateOnboardingStatus,
  clearUser,
  setAuthLoading,
  setAuthError,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
