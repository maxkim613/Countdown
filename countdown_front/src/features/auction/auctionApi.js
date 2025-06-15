// src/features/board/boardApi.js

// RTK Query에서 API 요청을 관리하는 설정입니다.
// 이 파일은 게시판과 댓글 관련 서버 통신을 정의합니다.

import { createApi } from "@reduxjs/toolkit/query/react"; // RTK Query 훅 생성을 위한 함수
import baseQueryWithAuthHandler from "../../cm/CmCustomBaseQuery"; // 사용자 정의 baseQuery (ex: 인증 처리 포함)

// createApi: RTK Query로 API 요청들을 정의합니다.
export const auctionApi = createApi({
  reducerPath: "auctionApi", // Redux 스토어에 저장될 키 이름
  baseQuery: baseQueryWithAuthHandler, // 모든 요청에서 사용할 공통 fetch 함수
  endpoints: (builder) => ({
    //여기에 query()와 mutation()을 정의
    // builder는 RTK Query가 제공하는 "엔드포인트 생성 도우미 객체

    // 🔍 게시판 목록 조회 (GET 대신 POST 사용)
    auctionList: builder.query({
      //query 조회용(GET 또는 POST) API를 정의
      query: (params) => ({
        url: "/auc/auclist.do",
        method: "POST",
        body: params,
      }),
      keepUnusedDataFor: 0, // 사용하지 않는 데이터 즉시 제거 (캐시 X)
      refetchOnMountOrArgChange: true, // 컴포넌트 마운트/파라미터 변경 시 자동 재요청
      staleTime: 0, // (참고용) 데이터가 항상 최신 상태라고 간주하지 않음
    }),

    // 🔍 게시판 목록 조회 (GET 대신 POST 사용)
    auctionMyList: builder.query({
      //query 조회용(GET 또는 POST) API를 정의
      query: (params) => ({
        url: "/auc/aucmylist.do",
        method: "POST",
        body: params,
      }),
      keepUnusedDataFor: 0, // 사용하지 않는 데이터 즉시 제거 (캐시 X)
      refetchOnMountOrArgChange: true, // 컴포넌트 마운트/파라미터 변경 시 자동 재요청
      staleTime: 0, // (참고용) 데이터가 항상 최신 상태라고 간주하지 않음
    }),

    // 🔍 게시글 상세 보기
    auctionView: builder.query({
      query: (params) => ({
        url: "/auc/aucview.do",
        method: "POST",
        body: params,
      }),
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
      staleTime: 0,
    }),

    // 📝 게시글 생성
    auctionCreate: builder.mutation({
      //mutation 변경용(POST/PUT/DELETE) API를 정의
      query: (formData) => ({
        url: "/auc/auccreate.do",
        method: "POST",
        body: formData,
      }),
    }),

    // 📝 게시글 생성
    auctionBid: builder.mutation({
      //mutation 변경용(POST/PUT/DELETE) API를 정의
      query: (formData) => ({
        url: "/auc/aucbid.do",
        method: "POST",
        body: formData,
      }),
    }),
    // 📝 게시글 생성
    auctionBuynow: builder.mutation({ 
      query: (formData) => ({
        url: "/auc/aucbuynow.do",
        method: "POST",
        body: formData,
      }),
    }),

    // ✏️ 게시글 수정
    auctionUpdate: builder.mutation({
      query: (formData) => ({
        url: "/auc/aucupdate.do",
        method: "POST",
        body: formData,
      }),
    }),

    // ❌ 게시글 삭제
    auctionDelete: builder.mutation({
      query: (params) => ({
        url: "/auc/aucdelete.do",
        method: "POST",
        body: params,
      }),
    }),
  }),
});

// 컴포넌트에서 사용할 수 있도록 export (자동 생성된 훅)
export const {
  useAuctionListQuery, // 게시판 목록 가져오기
  useAuctionMyListQuery, // 게시판 목록 가져오기
  useAuctionViewQuery, // 게시글 상세 조회
  useAuctionCreateMutation, // 게시글 생성
  useAuctionUpdateMutation, // 게시글 수정
  useAuctionDeleteMutation, // 게시글 삭제
  useAuctionBidMutation,
  useAuctionBuynowMutation,
} = auctionApi;
