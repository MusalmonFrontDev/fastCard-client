import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


import { users } from "../config/config";
interface User{
    firstname:string;
    lastname:string;
    avatar:string;
    email:string;
    number:string;
    city:string;
    adres:string;
    job:string;
    id:string;
}

interface UserState {
    user: User[];
    token: string | null;
}

const initialState: UserState = {
    user: users as User[],
    token: localStorage.getItem("token") || null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload;
            if (action.payload) {
                localStorage.setItem("token", action.payload);
            } else {
                localStorage.removeItem("token");
            }
        },
        logout: (state) => {
            state.token = null;
            localStorage.removeItem("token");
        }
    }
});

export const { setToken, logout } = userSlice.actions;
export default userSlice.reducer;