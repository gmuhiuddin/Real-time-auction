import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        auth: {}
    },
    reducers: {
        setUser: (state, { payload }) => {
            state.auth = payload
        },
        removeUser: state => {
            state.auth = {}
        }
    }
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice;