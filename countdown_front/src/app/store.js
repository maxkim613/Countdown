import { combineReducers, configureStore} from '@reduxjs/toolkit';
import userReducer from "../features/user/userSlice";
import storageSession from 'redux-persist/lib/storage/session';
import {persistReducer, persistStore} from 'redux-persist';
import { userApi } from '../features/user/UserApi';


const persistConfig = {
    key: 'root',
    storage: storageSession,
    whiteList: ['user']
};

const rootReducer = combineReducers({
    user: userReducer,
    [userApi.reducerPath]: userApi.reducer,

});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(userApi.middleware)
});

export const persistor = persistStore(store);