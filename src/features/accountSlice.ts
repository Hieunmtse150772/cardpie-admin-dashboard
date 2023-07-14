import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import AccountsDto from 'src/dtos/accounts.dto';
import activeAccount from 'src/dtos/activeAccount.dto';
import User from 'src/models/user.model';
import accountServices from 'src/services/account.service';

interface AccountState {
  isLoading: boolean;
  error: string;
  current: AccountsDto;
}

export const getAccounts = createAsyncThunk(
  'accounts',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await accountServices.getAccounts(page);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);
export const acctiveAccount = createAsyncThunk(
  'accounts',
  async (payload: activeAccount, { rejectWithValue }) => {
    try {
      const response = await accountServices.acctiveAccount(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);


// Define the initial state using that type
const initialState: AccountState = {
  isLoading: false,
  error: '',
  current: {
    data: [] as User[],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        isAnyOf(getAccounts.fulfilled),
        (state, action) => {
          state.current = action.payload;
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(
        isAnyOf(
          getAccounts.rejected,
        ),
        (state, action) => {
          state.isLoading = false;
          state.error = String(action.payload);
        },
      )
      .addMatcher(
        isAnyOf(
          getAccounts.pending,
        ),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      );
  },
});

export default accountSlice.reducer;
