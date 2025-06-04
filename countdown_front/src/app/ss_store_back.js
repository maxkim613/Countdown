// src/app/store.js

import { configureStore } from '@reduxjs/toolkit'; // Redux 스토어 구성 함수
import { userApi } from '../features/user/userApi'; // 사용자 API 슬라이스
import { boardApi } from '../features/board/boardApi'; // 게시판 API 슬라이스
import { fileApi } from '../features/file/fileApi'; // 파일 API 슬라이스

import userReducer from '../features/user/userSlice'; // 사용자 상태 리듀서
import storageSession from 'redux-persist/lib/storage/session'; // 세션 스토리지 사용
import { persistReducer, persistStore } from 'redux-persist'; // 상태 유지 라이브러리
import { combineReducers } from 'redux'; // 여러 리듀서를 병합

// redux-persist 설정 

// 그걸 **persistConfig**에 적는 거예요.
const persistConfig = {
  key: 'root', // 저장될 키 이름
  storage: storageSession, // sessionStorage 사용 (브라우저 세션 단위 저장)
  whitelist: ['user'] // user slice만 저장 대상
};

// 루트 리듀서 구성 (기본 리듀서 + API 리듀서들)
// 상태를 변경하는 방법(reducer)
const rootReducer = combineReducers({
  user: userReducer,
  [userApi.reducerPath]: userApi.reducer,
  [boardApi.reducerPath]: boardApi.reducer,
  [fileApi.reducerPath]: fileApi.reducer,
});

// 지속 가능한 리듀서로 래핑
const persistedReducer = persistReducer(persistConfig, rootReducer); 
// Redux에서 상태를 브라우저 저장소에 자동 저장하고, 앱이 다시 열렸을 때 복원되도록 만드는 기능"

// 스토어 생성

// configureStore란?
// Redux Toolkit에서 Redux 스토어를 만드는 함수예요.

// 원래 Redux에서는 createStore와 여러 설정이 필요했는데,
// configureStore는 그걸 간단하게 만들어준 도구입니다.

// 이 함수 안에 여러 설정(리듀서, 미들웨어 등)을 넣으면 Redux가 작동할 준비를 끝냅니다.

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // redux-persist 비직렬화 예외 허용
    }).concat(userApi.middleware, boardApi.middleware, fileApi.middleware) // API 미들웨어 추가
});

// persistor 객체 내보내기 (스토어 초기화 및 유지 관리용)
export const persistor = persistStore(store);


// 💡 리덕스(Redux)란?
// - 전역 상태 관리를 위한 자바스크립트 라이브러리입니다.
// - 여러 컴포넌트가 공유해야 하는 데이터를 한 곳(store)에 모아서 예측 가능하게 관리할 수 있습니다.
// - 상태(state)는 읽기 전용이며, 변경은 액션(action)을 통해서만 이뤄집니다.

// 💡 Redux Toolkit이란?
// - 리덕스를 더 쉽게 사용할 수 있도록 만든 공식 툴킷입니다.
// - 보일러플레이트(반복되는 코드)를 줄여주고, 비동기 처리 및 미들웨어 설정도 간편하게 만들어줍니다.

// 💡 redux-persist란?
// - 리덕스 상태를 localStorage나 sessionStorage에 저장해서 새로고침 후에도 상태를 유지할 수 있게 해줍니다.

// 💡 RTK Query란?
// - Redux Toolkit에 포함된 데이터 페칭 도구로, API 요청과 캐싱을 간단하게 처리할 수 있게 도와줍니다.
// - 여기서는 `userApi`, `boardApi`, `fileApi`처럼 API 기능을 slice로 관리하고 있습니다.

// 🔹 쉽게 설명하면:
// React 컴포넌트끼리 데이터를 공유하려면 props로 계속 넘겨줘야 하죠.
// 그런데 어떤 데이터는 모든 컴포넌트가 공통으로 필요할 때가 있어요.

// ➡️ 이럴 때 Redux의 store가 등장합니다.
// “앱 전체에서 공유할 수 있는 하나의 데이터 창고” 라고 생각하시면 돼요.

// 🏠 예시 비유:
// 컴포넌트 = 방 (각자 독립)

// 상태(state) = 정보를 담은 종이

// store = 모든 방에서 꺼내쓸 수 있는 중앙 금고

// React의 각 방(컴포넌트)은 금고(store)에서 정보를 꺼내 읽거나(조회), 새로 덮어쓸 수 있습니다(업데이트).

// 🔧 store는 어떤 걸 포함하나요?
// 현재 앱 상태(state)

// 상태를 변경하는 방법(reducer)

// 비동기 처리 또는 API 호출용 미들웨어

// DevTools 같은 개발도구 지원


//persistConfig란?
// redux-persist라는 라이브러리에서 사용하는 설정 객체예요.

// Redux 상태를 브라우저 저장소(localStorage, sessionStorage)에 저장하려면,
// 어떻게 저장할지 설정이 필요합니다.