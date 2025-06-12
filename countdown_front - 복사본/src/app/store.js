// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { userApi } from '../features/user/UserApi';
import { boardApi } from '../features/board/boardApi'; 
import { auctionApi } from '../features/auction/auctionApi'; 
import { announcementApi } from '../features/announcement/announcementApi'; 
import { fileApi } from '../features/file/fileApi'; 

import userReducer from '../features/user/userSlice';
import storageSession from 'redux-persist/lib/storage/session'; // sessionStorage로 변경
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';

const persistConfig = {
  key: 'root',
  storage: storageSession, // sessionStorage로 변경
  whitelist: ['user'] // user slice만 저장
};
const rootReducer = combineReducers({
  user: userReducer,
  [userApi.reducerPath]: userApi.reducer,
  [boardApi.reducerPath]: boardApi.reducer,
  [fileApi.reducerPath]: fileApi.reducer,
  [auctionApi.reducerPath]: auctionApi.reducer,
  [announcementApi.reducerPath]: announcementApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(userApi.middleware, boardApi.middleware, fileApi.middleware, auctionApi.middleware,announcementApi.middleware)
});

export const persistor = persistStore(store);
