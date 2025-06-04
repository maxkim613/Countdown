// src/features/board/boardApi.js

// RTK Query에서 API 요청을 관리하는 설정입니다.
// 이 파일은 게시판과 댓글 관련 서버 통신을 정의합니다.

import { createApi } from "@reduxjs/toolkit/query/react"; // RTK Query 훅 생성을 위한 함수
import baseQueryWithAuthHandler from "../../cm/CmCustomBaseQuery"; // 사용자 정의 baseQuery (ex: 인증 처리 포함)

// createApi: RTK Query로 API 요청들을 정의합니다.
export const boardApi = createApi({
  reducerPath: 'boardApi', // Redux 스토어에 저장될 키 이름
  baseQuery: baseQueryWithAuthHandler, // 모든 요청에서 사용할 공통 fetch 함수
  endpoints: (builder) => ({ //여기에 query()와 mutation()을 정의 
                             // builder는 RTK Query가 제공하는 "엔드포인트 생성 도우미 객체

    // 🔍 게시판 목록 조회 (GET 대신 POST 사용)
    boardList: builder.query({ //query 조회용(GET 또는 POST) API를 정의
      query: (params) => ({
        url: "/board/list.do",
        method: "POST",
        body: params,
      }),
      keepUnusedDataFor: 0, // 사용하지 않는 데이터 즉시 제거 (캐시 X)
      refetchOnMountOrArgChange: true, // 컴포넌트 마운트/파라미터 변경 시 자동 재요청
      staleTime: 0, // (참고용) 데이터가 항상 최신 상태라고 간주하지 않음
    }),

    // 🔍 게시글 상세 보기
    boardView: builder.query({
      query: (params) => ({
        url: "/board/view.do",
        method: "POST",
        body: params,
      }),
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
      staleTime: 0,
    }),

    // 📝 게시글 생성
    boardCreate: builder.mutation({ //mutation 변경용(POST/PUT/DELETE) API를 정의
      query: (formData) => ({
        url: "/board/create.do",
        method: "POST",
        body: formData,
      }),
    }),

    // ✏️ 게시글 수정
    boardUpdate: builder.mutation({
      query: (formData) => ({
        url: "/board/update.do",
        method: "POST",
        body: formData,
      }),
    }),

    // ❌ 게시글 삭제
    boardDelete: builder.mutation({
      query: (params) => ({
        url: "/board/delete.do",
        method: "POST",
        body: params,
      }),
    }),

    // 💬 댓글 생성
    commentCreate: builder.mutation({
      query: (comment) => ({
        url: "/board/comment/create.do",
        method: "POST",
        body: comment,
      }),
    }),

    // 🛠️ 댓글 수정
    commentUpdate: builder.mutation({
      query: (comment) => ({
        url: "/board/comment/update.do",
        method: "POST",
        body: comment,
      }),
    }),

    // 🗑️ 댓글 삭제
    commentDelete: builder.mutation({
      query: (comment) => ({
        url: "/board/comment/delete.do",
        method: "POST",
        body: comment,
      }),
    }),
  }),
});

// 컴포넌트에서 사용할 수 있도록 export (자동 생성된 훅)
export const {
  useBoardListQuery,      // 게시판 목록 가져오기
  useBoardViewQuery,      // 게시글 상세 조회
  useBoardCreateMutation, // 게시글 생성
  useBoardUpdateMutation, // 게시글 수정
  useBoardDeleteMutation, // 게시글 삭제
  useCommentCreateMutation, // 댓글 생성
  useCommentUpdateMutation, // 댓글 수정
  useCommentDeleteMutation, // 댓글 삭제
} = boardApi;