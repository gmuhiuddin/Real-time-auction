import { combineReducers } from "redux";
import userSlice from './userSlice.jsx';

const rootReducer = combineReducers({
    userInfo: userSlice.reducer
});

export default rootReducer;