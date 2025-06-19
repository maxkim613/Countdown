import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery';

export const msgApi = createApi({
    reducerPath: 'msgApi',
    baseQuery: baseQueryWithAuthHandler,
    tagTypes: ['Msg'],
    endpoints: (builder) => ({
        getMsgList: builder.query({
            // 수정: 백엔드 MsgController의 @GetMapping("")에 맞게 경로를 수정합니다.
            query: (search) => ({ url: `/msg`, params: search }),
            transformResponse: (response) => response.data,
            providesTags: ['Msg'],
        }),
        getMsgDetail: builder.query({
            // 이 경로는 백엔드 @GetMapping("/{msgId}")와 일치하므로 올바릅니다.
            query: (msgId) => `/msg/${msgId}`,
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: 'Msg', id }],
        }),
        sendMsg: builder.mutation({
            // 이 경로는 백엔드 @PostMapping("")와 일치하므로 올바릅니다.
            query: (msg) => ({ url: '/msg', method: 'POST', body: msg }),
            invalidatesTags: ['Msg'],
        }),
        getInquiryList: builder.query({
            // 이 경로는 백엔드 AdminMsgController의 @GetMapping("/inquiries")와 일치하므로 올바릅니다.
            query: (search) => ({ url: '/admin/msg/inquiries', params: search }),
            transformResponse: (response) => response.data,
            providesTags: ['Msg'],
        }),
        sendAdminReply: builder.mutation({
            // 이 경로는 백엔드 AdminMsgController의 @PostMapping("/reply")와 일치하므로 올바릅니다.
            query: (reply) => ({ url: '/admin/msg/reply', method: 'POST', body: reply }),
            invalidatesTags: ['Msg'],
        }),
    }),
});

export const {
    useGetMsgListQuery,
    useGetMsgDetailQuery,
    useSendMsgMutation,
    useGetInquiryListQuery,
    useSendAdminReplyMutation,
} = msgApi;