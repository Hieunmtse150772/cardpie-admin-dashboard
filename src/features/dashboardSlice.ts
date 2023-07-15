import {
    createAsyncThunk,
    createSlice,
    isAnyOf,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import DashBoardDto from 'src/dtos/dashboard.dto';
import dashboardService from 'src/services/dashboard.service';

interface DashBoardState {
    isLoading: boolean;
    error: string;
    current: DashBoardDto;
}

export const getInformation = createAsyncThunk(
    'dasboard',
    async () => {
        try {
            const response = await dashboardService.getInformation();
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
        }
    },
);

// Define the initial state using that type
const initialState: DashBoardState = {
    isLoading: false,
    error: '',
    current: {
        data: {
            total_user: 0,
            total_new_user: 0,
            total_premium_account: 0,
            total_income: 0
        }
    },
};

export const dashBoardSlice = createSlice({
    name: 'dasboard',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addMatcher(
                isAnyOf(getInformation.fulfilled),
                (state, action) => {
                    state.current = action.payload;
                    state.error = '';
                    state.isLoading = false;
                },
            )
            .addMatcher(
                isAnyOf(
                    getInformation.rejected,
                ),
                (state, action) => {
                    state.isLoading = false;
                    state.error = String(action.payload);
                },
            )
            .addMatcher(
                isAnyOf(
                    getInformation.pending,
                ),
                state => {
                    state.isLoading = true;
                    state.error = '';
                },
            );
    },
});

export default dashBoardSlice.reducer;
