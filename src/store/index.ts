import { configureStore, combineReducers } from "@reduxjs/toolkit";
import freelancerReducer from "./slices/freelancerSlice";
import authReducer from "./slices/authSlice";
import loadingReducer from "./slices/loadingSlice";
import { persistReducer, persistStore } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session"; // <-- sessionStorage
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const freelancerPersistConfig = {
  key: "freelancerOnboarding",
  storage: storageSession, // sessionStorage
};

const persistedFreelancerReducer = persistReducer(
  freelancerPersistConfig,
  freelancerReducer
);

const rootReducer = combineReducers({
  freelancer: persistedFreelancerReducer,
  auth: authReducer,
  loading: loadingReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
