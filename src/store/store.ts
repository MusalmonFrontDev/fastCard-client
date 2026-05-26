import { configureStore } from '@reduxjs/toolkit'
import userList from '../UserSlice/userSlice'
import shopReducer from './shopSlice'

export const store = configureStore({
    reducer: {
        users: userList,
        shop: shopReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch