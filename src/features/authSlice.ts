import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'src/app/store';
import LoginDto from 'src/dtos/login.dto';
import User from 'src/models/user.model';
import { authService } from 'src/services/auth.service';
import { AxiosError } from 'axios';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean,
  error: string,

  // Thêm các trường khác liên quan đến người dùng nếu cần thiết
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: ''
}
export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginDto, { rejectWithValue }) => {
    try {
      const response = await authService.login(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = String(action.payload);
        state.loading = false;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = String(action.payload);
        state.loading = false;
      });
  },
});

export const selectUser = (state: RootState) => state.auth.user;
export default authSlice.reducer;
