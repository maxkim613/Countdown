// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { userApi } from '../features/user/UserApi';
import { boardApi } from '../features/board/boardApi'; 
import { auctionApi } from '../features/auction/auctionApi'; 
import { announcementApi } from '../features/announcement/announcementApi'; 
import { fileApi } from '../features/file/fileApi'; 
import { msgApi } from '../features/msg/msgApi';
import { codeApi } from '../features/code/codeApi';

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
  [msgApi.reducerPath]: msgApi.reducer, // msgApi의 리듀서 추가
  [codeApi.reducerPath]: codeApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(
      userApi.middleware, 
      boardApi.middleware, 
      fileApi.middleware, 
      auctionApi.middleware,
      announcementApi.middleware,
      msgApi.middleware, // msgApi의 미들웨어 추가
      codeApi.middleware 
    ),
});

export const persistor = persistStore(store);
