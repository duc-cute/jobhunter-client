import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import accountReducer from "./slice/accountSlide";
import companyReducer from "./slice/companySlide";
import userReducer from "./slice/userSlide";
import jobReducer from "./slice/jobSlide";
import resumeReducer from "./slice/resumeSlide";
import permissionReducer from "./slice/permissionSlide";
import roleReducer from "./slice/roleSlide";
import skillReducer from "./slice/skillSlide";
import hrReducer from "./slice/hrSlide";
import dashBoardReducer from "./slice/dashboardSlide";

export const store = configureStore({
  reducer: {
    account: accountReducer,
    company: companyReducer,
    user: userReducer,
    job: jobReducer,
    resume: resumeReducer,
    permission: permissionReducer,
    role: roleReducer,
    skill: skillReducer,
    hr: hrReducer,
    dashBoard: dashBoardReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
