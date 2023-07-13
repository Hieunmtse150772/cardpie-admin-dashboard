// store.ts

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from '../features/authSlice';
import accountReducer from '../features/accountSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer
    // Thêm reducers khác nếu cần thiết
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
