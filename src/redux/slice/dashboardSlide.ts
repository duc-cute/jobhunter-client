import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callFetchDashboard, callFetchPermission } from "@/config/api";
import { IPermission, IRangeTime } from "@/types/backend";

interface IState {
  isFetching: boolean;
  data: {
    companies: number;
    cvs: number;
    jobs: number;
    users: number;
    listReportCompany: [];
  };
}
// First, create the thunk
export const fetchReport = createAsyncThunk(
  "report/fetchReport",
  async (body: IRangeTime) => {
    const response = await callFetchDashboard(body);
    return response;
  }
);

const initialState: IState = {
  isFetching: true,
  data: {
    companies: 0,
    cvs: 0,
    jobs: 0,
    users: 0,
    listReportCompany: [],
  },
};

export const dashBoardSlide = createSlice({
  name: "dashboard",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchReport.pending, (state, action) => {
      state.isFetching = true;
      // Add user to the state array
      // state.courseOrder = action.payload;
    });

    builder.addCase(fetchReport.rejected, (state, action) => {
      state.isFetching = false;
      // Add user to the state array
      // state.courseOrder = action.payload;
    });

    builder.addCase(fetchReport.fulfilled, (state, action) => {
      if (action.payload && action.payload.data) {
        state.isFetching = false;
        state.data = action.payload.data;
      }
      // Add user to the state array

      // state.courseOrder = action.payload;
    });
  },
});

export const {} = dashBoardSlide.actions;

export default dashBoardSlide.reducer;
