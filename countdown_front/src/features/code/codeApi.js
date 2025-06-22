import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthHandler from '../../cm/CmCustomBaseQuery';

export const codeApi = createApi({
    reducerPath: 'codeApi',
    baseQuery: baseQueryWithAuthHandler,
    endpoints: (builder) => ({
        getCodes: builder.query({
            query: (groupCode) => `/codes/${groupCode}`,
            transformResponse: (response) => {
                if (!response || !response.data) {
                    return [];
                } 
                return response.data.map(code => ({
                    label: code.codeName, // 화면에 표시될 이름 (예: "최신순")
                    value: code.codeId    // 실제 값으로 사용될 ID (예: "DESC")
                }));
            },
        }),
    }),
}); 

export const { useGetCodesQuery } = codeApi;