// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { userApi } from '../features/user/UserApi';
import { boardApi } from '../features/board/boardApi'; 
import { fileApi } from '../features/file/fileApi'; 

import userReducer from '../features/user/userSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';

const persistConfig = {
  key: 'root',
  storage: storage, // 로컬스토리지에 저장
  whitelist: ['user'] // user slice만 저장
};
const rootReducer = combineReducers({
  user: userReducer,
  [userApi.reducerPath]: userApi.reducer,
  [boardApi.reducerPath]: boardApi.reducer,
  [fileApi.reducerPath]: fileApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(userApi.middleware, boardApi.middleware, fileApi.middleware)
});

export const persistor = persistStore(store);
