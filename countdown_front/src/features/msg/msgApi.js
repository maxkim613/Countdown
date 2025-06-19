import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery';

// 백엔드 API와 통신하기 위한 API 슬라이스 생성
export const msgApi = createApi({
    reducerPath: 'msgApi',
    baseQuery: baseQueryWithAuthHandler, // 수정: 인증 처리 기능이 포함된 baseQuery 사용
    tagTypes: ['Msg'],
    endpoints: (builder) => ({
        // 쪽지 목록 조회
        getMsgList: builder.query({
            query: (search) => {
                const params = new URLSearchParams({
                    msgBox: search.msgBox || 'received',
                    msgType: search.msgType || 'ALL',
                    searchCondition: search.searchCondition || '',
                    searchKeyword: search.searchKeyword || '',
                    sortOrder: search.sortOrder || 'DESC',
                });
                return {
                    url: `/msg`, // url과 params를 객체로 전달
                    params: params,
                };
            },
            transformResponse: (response) => response.data,
            providesTags: ['Msg'],
        }),
        // 쪽지 상세 조회
        getMsgDetail: builder.query({
            query: (msgId) => `/msg/${msgId}`,
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: 'Msg', id }],
        }),
        // 쪽지 보내기
        sendMsg: builder.mutation({
            query: (msg) => ({
                url: '/msg',
                method: 'POST',
                body: msg,
            }),
            invalidatesTags: ['Msg'],
        }),
        // [관리자] 문의 목록 조회
        getInquiryList: builder.query({
            query: () => '/msg/admin/inquiries',
            transformResponse: (response) => response.data,
            providesTags: ['Msg'],
        }),
        // [관리자] 문의 답변 보내기
        sendAdminReply: builder.mutation({
            query: (reply) => ({
                url: '/msg/admin/reply',
                method: 'POST',
                body: reply,
            }),
            invalidatesTags: ['Msg'],
        }),
    }),
});

// 생성된 훅들을 export
export const {
    useGetMsgListQuery,
    useGetMsgDetailQuery,
    useSendMsgMutation,
    useGetInquiryListQuery,
    useSendAdminReplyMutation,
} = msgApi;