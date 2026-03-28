import {combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from './userSlice'
import cartSlice from './cartSlice'

import { persistStore  } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import persistReducer from "redux-persist/es/persistReducer"; 

const persistConfig = {
  key: 'root',
  version:1,
  storage,
}
const reducer = combineReducers({
       user:userSlice,
       cart:cartSlice
})

const persistedReducer = persistReducer(persistConfig, reducer)


export const store = configureStore({
    reducer: persistedReducer,
     middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({serializableCheck:false})
     
    
})
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch